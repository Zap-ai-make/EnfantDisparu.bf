import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Endpoint de développement pour simuler des statistiques réalistes.
 * Utilisé avant d'avoir les vraies intégrations Facebook/WhatsApp/OneSignal.
 *
 * Appel: POST /api/dev/seed-stats
 * Body (optionnel): { announcementId: "..." } — si omis, met à jour toutes les annonces actives
 */
export async function POST(req: NextRequest) {
  // Bloquer en production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const db = getAdminDb();

  try {
    const body = await req.json().catch(() => ({}));
    const { announcementId } = body as { announcementId?: string };

    let docs;

    if (announcementId) {
      // Mettre à jour une annonce spécifique
      const docRef = db.collection("announcements").doc(announcementId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
      }
      docs = [docSnap];
    } else {
      // Mettre à jour toutes les annonces actives
      const snapshot = await db
        .collection("announcements")
        .where("status", "==", "active")
        .limit(20)
        .get();
      docs = snapshot.docs;
    }

    const updated: string[] = [];

    for (const doc of docs) {
      const data = doc.data() ?? {};
      const createdAt: Date = (data.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date();
      const hoursElapsed = (Date.now() - createdAt.getTime()) / (1000 * 3600);

      // Générer des stats réalistes basées sur le temps écoulé
      const stats = generateRealisticStats(hoursElapsed, data.isSecureID ?? false);

      await doc.ref.update({
        stats: {
          ...data.stats,
          ...stats,
        },
        updatedAt: FieldValue.serverTimestamp(),
      });

      updated.push(data.shortCode ?? doc.id);
    }

    return NextResponse.json({
      success: true,
      updated,
      message: `Stats simulées pour ${updated.length} annonce(s): ${updated.join(", ")}`,
    });
  } catch (error) {
    console.error("Seed stats error:", error);
    return NextResponse.json(
      { error: "Internal error", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Génère des stats réalistes basées sur le temps écoulé depuis la création
 * Simule une courbe de diffusion organique
 */
function generateRealisticStats(hoursElapsed: number, isSecureID: boolean) {
  // Facteur multiplicateur SecureID (prioritaire = +50% de portée)
  const boost = isSecureID ? 1.5 : 1;

  // Courbe de croissance : rapide les premières heures, puis plateau
  const growthFactor = Math.min(1, hoursElapsed / 12); // atteint 100% après 12h

  // Variation aléatoire ±15% pour simuler la réalité
  const rand = (base: number) =>
    Math.round(base * (0.85 + Math.random() * 0.3) * boost * growthFactor);

  // Modèle de diffusion :
  // - Facebook : grande portée organique (page + partages)
  // - WhatsApp chaîne : lecture par les abonnés
  // - OneSignal push : ciblé par zone
  // - Page views : personnes qui cliquent sur le lien

  // Facebook — portée organique
  const facebookReach = rand(2400);         // Vues du post
  const facebookLikes = rand(127);          // Likes / réactions
  const facebookShares = rand(85);          // Partages (viral)
  const facebookClicks = rand(320);         // Clics vers l'annonce

  // WhatsApp chaîne — audience de la communauté
  const whatsappChannelReach = rand(1250);  // Abonnés de la chaîne qui ont vu le message

  const whatsappSent = 1;                   // Lien gestion envoyé au parent
  const whatsappDelivered = 1;
  const whatsappRead = 1;

  // OneSignal — abonnés push du secteur géographique
  const pushSent = rand(180);
  const pushClicked = Math.round(pushSent * (0.25 + Math.random() * 0.15));

  const pageViews = facebookClicks + pushClicked + rand(60);
  const alertSubscribers = Math.round(rand(12));

  return {
    facebookReach,
    facebookLikes,
    facebookShares,
    facebookClicks,
    whatsappChannelReach,
    whatsappSent,
    whatsappDelivered,
    whatsappRead,
    pushSent,
    pushClicked,
    pageViews,
    alertSubscribers,
    facebookPostId: `sim_${Date.now()}`,
  };
}

// Support GET pour faciliter le test dans le navigateur
export async function GET() {
  return NextResponse.json({
    info: "Endpoint de simulation de stats",
    usage: "POST /api/dev/seed-stats",
    body: "{ announcementId: 'optionnel — si omis, met à jour toutes les annonces actives' }",
    note: "Disponible uniquement en développement (NODE_ENV !== production)",
  });
}
