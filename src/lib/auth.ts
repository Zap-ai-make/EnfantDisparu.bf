/**
 * Utilitaires d'authentification admin
 */

import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Comparaison timing-safe de deux chaînes
 * Protège contre les attaques par timing
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare with itself to prevent timing leak on length
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/**
 * Vérifie si la requête est authentifiée comme admin
 * Utilise le header x-admin-password
 */
export function isAdminAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-password");
  if (!ADMIN_PASSWORD || !authHeader) return false;
  return safeCompare(authHeader, ADMIN_PASSWORD);
}

/**
 * Vérifie le mot de passe admin directement
 */
export function verifyAdminPassword(password: string): boolean {
  if (!ADMIN_PASSWORD || typeof password !== "string") return false;
  return safeCompare(password, ADMIN_PASSWORD);
}

/**
 * Indique si le mot de passe admin est configuré
 */
export function isAdminPasswordConfigured(): boolean {
  return !!ADMIN_PASSWORD;
}
