/**
 * Migration Script: vigies → ambassadors
 *
 * Ce script migre les documents de la collection "vigies" vers "ambassadors".
 *
 * Usage:
 *   npx ts-node scripts/migrate-vigies-to-ambassadors.ts
 *
 * Mode dry-run (par défaut):
 *   npx ts-node scripts/migrate-vigies-to-ambassadors.ts --dry-run
 *
 * Mode exécution réelle:
 *   npx ts-node scripts/migrate-vigies-to-ambassadors.ts --execute
 *
 * Prérequis:
 *   - GOOGLE_APPLICATION_CREDENTIALS doit pointer vers le fichier de service account
 *   - Ou exécuter depuis un environnement avec accès Firebase Admin
 */

import * as admin from "firebase-admin";
import * as crypto from "crypto";

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ─── Configuration ─────────────────────────────────────────────────────────

const DRY_RUN = !process.argv.includes("--execute");
const BATCH_SIZE = 500;

// ─── Helpers ───────────────────────────────────────────────────────────────

const ALPHANUMERIC_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRefCodeCandidate(): string {
  let code = "";
  const bytes = crypto.randomBytes(4);
  for (let i = 0; i < 4; i++) {
    code += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return `AMB-${code}`;
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("00226")) {
    cleaned = "+226" + cleaned.slice(5);
  }

  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+226" + cleaned.slice(1);
  }

  if (/^\d{8}$/.test(cleaned)) {
    cleaned = "+226" + cleaned;
  }

  if (cleaned.startsWith("+226")) {
    const rest = cleaned.slice(4).replace(/\D/g, "");
    cleaned = "+226" + rest;
  }

  return cleaned;
}

// ─── Migration ─────────────────────────────────────────────────────────────

interface VigieDoc {
  name?: string;
  phone?: string;
  zoneId?: string;
  motivation?: string;
  createdAt?: admin.firestore.Timestamp;
}

interface MigrationResult {
  vigieId: string;
  ambassadorId?: string;
  refCode?: string;
  status: "migrated" | "skipped" | "error";
  reason?: string;
}

async function generateUniqueRefCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generateRefCodeCandidate();
    const existing = await db
      .collection("ambassadors")
      .where("refCode", "==", candidate)
      .limit(1)
      .get();

    if (existing.empty) {
      return candidate;
    }
  }
  throw new Error("Could not generate unique refCode after 10 attempts");
}

async function migrateVigie(
  vigieDoc: admin.firestore.QueryDocumentSnapshot
): Promise<MigrationResult> {
  const vigieId = vigieDoc.id;
  const data = vigieDoc.data() as VigieDoc;

  // Vérifier les champs requis
  if (!data.phone) {
    return { vigieId, status: "skipped", reason: "No phone number" };
  }

  const normalizedPhone = normalizePhone(data.phone);

  // Vérifier si un ambassadeur existe déjà avec ce téléphone
  const existingAmbassador = await db
    .collection("ambassadors")
    .where("phone", "==", normalizedPhone)
    .limit(1)
    .get();

  if (!existingAmbassador.empty) {
    return {
      vigieId,
      status: "skipped",
      reason: `Ambassador already exists with this phone: ${existingAmbassador.docs[0].id}`,
    };
  }

  // Générer un refCode unique
  const refCode = await generateUniqueRefCode();

  // Extraire prénom/nom du champ name
  const nameParts = (data.name ?? "Vigie").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "Vigie";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Date de naissance par défaut (30 ans)
  const defaultDob = new Date();
  defaultDob.setFullYear(defaultDob.getFullYear() - 30);

  const ambassadorData = {
    refCode,
    firstName,
    lastName,
    phone: normalizedPhone,
    zones: data.zoneId ? [data.zoneId] : [],
    dateOfBirth: admin.firestore.Timestamp.fromDate(defaultDob),
    catAnswer: "maybe" as const,
    status: "approved" as const,
    createdAt: data.createdAt ?? admin.firestore.FieldValue.serverTimestamp(),
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    approvedBy: "migration_script",
    stats: {
      notificationsActivated: 0,
      alertsShared: 0,
      ambassadorsRecruited: 0,
      viewsGenerated: 0,
    },
    migratedFrom: {
      collection: "vigies",
      documentId: vigieId,
      migratedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  };

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would create ambassador:`, {
      vigieId,
      refCode,
      firstName,
      lastName,
      phone: normalizedPhone,
    });
    return { vigieId, status: "migrated", refCode };
  }

  // Créer l'ambassadeur
  const ambassadorRef = await db.collection("ambassadors").add(ambassadorData);

  return {
    vigieId,
    ambassadorId: ambassadorRef.id,
    refCode,
    status: "migrated",
  };
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Migration: vigies → ambassadors");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (aucune modification)" : "EXECUTION RÉELLE"}`);
  console.log("");

  // Récupérer toutes les vigies
  const vigiesSnapshot = await db.collection("vigies").get();
  const totalVigies = vigiesSnapshot.size;

  console.log(`Found ${totalVigies} vigies to migrate`);
  console.log("");

  const results: MigrationResult[] = [];
  let processed = 0;

  for (const vigieDoc of vigiesSnapshot.docs) {
    try {
      const result = await migrateVigie(vigieDoc);
      results.push(result);

      if (result.status === "migrated") {
        console.log(`✅ ${vigieDoc.id} → ${result.refCode}`);
      } else {
        console.log(`⏭️  ${vigieDoc.id}: ${result.reason}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      results.push({ vigieId: vigieDoc.id, status: "error", reason: errorMsg });
      console.log(`❌ ${vigieDoc.id}: ${errorMsg}`);
    }

    processed++;
    if (processed % 50 === 0) {
      console.log(`\nProgress: ${processed}/${totalVigies}`);
    }
  }

  // Résumé
  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  RÉSUMÉ");
  console.log("═══════════════════════════════════════════════════════════");

  const migrated = results.filter((r) => r.status === "migrated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  console.log(`Total vigies:    ${totalVigies}`);
  console.log(`Migrées:         ${migrated}`);
  console.log(`Ignorées:        ${skipped}`);
  console.log(`Erreurs:         ${errors}`);
  console.log("");

  if (DRY_RUN) {
    console.log("🔔 Mode DRY-RUN: Aucune modification n'a été effectuée.");
    console.log("   Pour exécuter réellement, lancez avec --execute");
  } else {
    console.log("✅ Migration terminée.");
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
