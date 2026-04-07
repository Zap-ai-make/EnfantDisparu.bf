import { nanoid } from "nanoid";
import type { Announcement } from "@/types/announcement";

/**
 * Génère un code court unique pour l'annonce (ex: EPB-A7xK9mP2)
 * Utilise nanoid pour une génération cryptographiquement sécurisée
 */
export function generateShortCode(): string {
  // nanoid génère des IDs URL-safe avec 21 caractères par défaut
  // On utilise 8 caractères pour un bon équilibre lisibilité/unicité
  const id = nanoid(8);
  return `EPB-${id}`;
}

/**
 * Génère un token secret cryptographiquement sécurisé
 * Utilisé pour les liens de gestion d'annonce
 */
export function generateSecretToken(): string {
  // 32 caractères hex = 128 bits d'entropie (très sécurisé)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Masque un numero de telephone pour affichage public
 * +22670123456 → +226 70 XX XX XX
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 11) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} XX XX XX`;
  }
  return phone.slice(0, 6) + "XXXXXX";
}

/**
 * Retourne les stats par defaut pour une nouvelle annonce
 */
export function getDefaultStats(): Announcement["stats"] {
  return {
    facebookPostId: null,
    facebookReach: 0,
    facebookLikes: 0,
    facebookShares: 0,
    facebookClicks: 0,
    // Instagram
    instagramPostId: null,
    instagramReach: 0,
    instagramLikes: 0,
    instagramShares: 0,
    instagramComments: 0,
    // Twitter/X
    twitterPostId: null,
    twitterImpressions: 0,
    twitterLikes: 0,
    twitterRetweets: 0,
    twitterReplies: 0,
    // WhatsApp
    whatsappChannelReach: 0,
    whatsappSent: 0,
    whatsappDelivered: 0,
    whatsappRead: 0,
    // Push notifications
    pushSent: 0,
    pushClicked: 0,
    // Page analytics
    pageViews: 0,
    alertSubscribers: 0,
    // TikTok
    tiktokVideoId: null,
    tiktokViews: 0,
    tiktokLikes: 0,
    tiktokShares: 0,
    tiktokComments: 0,
  };
}
