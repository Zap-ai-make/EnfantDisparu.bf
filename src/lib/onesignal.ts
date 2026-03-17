// Utilitaires OneSignal côté CLIENT uniquement
// L'envoi des notifications se fait côté SERVEUR (Cloud Functions)
// Ce fichier gère uniquement l'abonnement et les tags côté navigateur

import OneSignal from "react-onesignal";

// Taguer l'abonné avec sa zone géographique
// → permet à OneSignal de filtrer par zone lors de l'envoi
export async function setUserZone(zoneId: string): Promise<void> {
  try {
    await OneSignal.User.addTag("zone", zoneId);
  } catch (err) {
    console.error("OneSignal setUserZone error:", err);
  }
}

// Vérifier si l'utilisateur est abonné aux notifications
export async function isSubscribed(): Promise<boolean> {
  try {
    return OneSignal.User.PushSubscription.optedIn ?? false;
  } catch {
    return false;
  }
}

// Demander la permission manuellement (si l'auto-prompt a été refusé)
export async function requestPermission(): Promise<void> {
  try {
    await OneSignal.User.PushSubscription.optIn();
  } catch (err) {
    console.error("OneSignal requestPermission error:", err);
  }
}
