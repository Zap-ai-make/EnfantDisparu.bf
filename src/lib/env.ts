/**
 * Validation des variables d'environnement
 * Ce fichier est importé au démarrage pour vérifier que toutes les variables requises sont présentes
 */

// Variables requises côté serveur
const REQUIRED_SERVER_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
] as const;

// Variables optionnelles (avec valeurs par défaut ou fonctionnalités dégradées)
const OPTIONAL_ENV = [
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_SERVICE_ACCOUNT_KEY", // Pour les fonctions serveur
] as const;

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Valide les variables d'environnement requises
 * @returns Résultat de la validation avec les variables manquantes
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Vérifier les variables requises
  for (const key of REQUIRED_SERVER_ENV) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Vérifier les variables optionnelles (avertissement seulement)
  for (const key of OPTIONAL_ENV) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Valide les variables et lance une erreur si des variables requises manquent
 * À appeler au démarrage de l'application
 */
export function assertEnv(): void {
  const result = validateEnv();

  if (!result.valid) {
    console.error("❌ Variables d'environnement manquantes:");
    result.missing.forEach((key) => console.error(`   - ${key}`));
    console.error("\nCréez un fichier .env.local avec ces variables.");

    // En production, on lance une erreur
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${result.missing.join(", ")}`);
    }
  }

  if (result.warnings.length > 0 && process.env.NODE_ENV === "development") {
    console.warn("⚠️ Variables d'environnement optionnelles manquantes:");
    result.warnings.forEach((key) => console.warn(`   - ${key}`));
  }
}

// Types pour les variables d'environnement personnalisées
// Note: NODE_ENV est déjà défini par Next.js/Node, on ne le redéclare pas
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Firebase (public)
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
      NEXT_PUBLIC_FIREBASE_APP_ID?: string;

      // Firebase (serveur)
      FIREBASE_SERVICE_ACCOUNT_KEY?: string;
    }
  }
}

export {};
