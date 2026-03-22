"use client";

import { useEffect, useState } from "react";
import { getStoredAmbassadorRef } from "./AmbassadorRefTracker";
import { ZoneSelectionModal, hasSelectedZone } from "./ZoneSelectionModal";

const NOTIF_CREDITED_KEY = "onesignal_notif_credited";

/**
 * Incrémente le compteur notificationsActivated de l'ambassadeur référent
 */
async function creditAmbassadorForNotification(refCode: string): Promise<void> {
  try {
    // Vérifier qu'on n'a pas déjà crédité cet ambassadeur
    const alreadyCredited = localStorage.getItem(NOTIF_CREDITED_KEY);
    if (alreadyCredited === refCode) {
      return; // Déjà crédité, ne pas re-incrémenter
    }

    const response = await fetch("/api/ambassador/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refCode,
        statKey: "notificationsActivated",
        amount: 1,
      }),
    });

    if (response.ok) {
      // Marquer comme crédité pour éviter les doublons
      localStorage.setItem(NOTIF_CREDITED_KEY, refCode);
      console.log(`OneSignal: Ambassador ${refCode} credited for notification activation`);
    }
  } catch (error) {
    console.error("OneSignal: Failed to credit ambassador:", error);
  }
}

// Référence globale pour OneSignal (pour pouvoir ajouter les tags depuis le modal)
let oneSignalInstance: typeof import("react-onesignal").default | null = null;

/**
 * Ajoute les tags de zone à OneSignal
 */
export function setOneSignalZoneTags(
  zoneId: string,
  zoneName: string,
  city: string,
  countryCode: string
): void {
  if (oneSignalInstance) {
    oneSignalInstance.User.addTags({
      zone_id: zoneId,
      zone_name: zoneName,
      city: city,
      country: countryCode,
    });
    console.log("OneSignal: Zone tags added:", { zoneId, city, countryCode });
  }
}

export function OneSignalInit() {
  const [showZoneModal, setShowZoneModal] = useState(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    // Ne pas initialiser si pas d'appId ou en développement sans config
    if (!appId) {
      console.log("OneSignal: No app ID configured, skipping initialization");
      return;
    }

    // Vérifier qu'on est côté client
    if (typeof window === "undefined") return;

    // Import dynamique pour éviter les erreurs SSR
    import("react-onesignal").then((OneSignalModule) => {
      const OneSignal = OneSignalModule.default;
      oneSignalInstance = OneSignal;

      OneSignal.init({
        appId,
        // Laisser le dashboard OneSignal gérer les prompts
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        // Envoyer le tag ambassador_ref si présent
        const ambassadorRef = getStoredAmbassadorRef();
        if (ambassadorRef) {
          OneSignal.User.addTag("ambassador_ref", ambassadorRef);
        }

        // Écouter les changements d'abonnement aux notifications
        OneSignal.User.PushSubscription.addEventListener("change", (event) => {
          // Si l'utilisateur vient de s'abonner (optedIn passe à true)
          if (event.current.optedIn && !event.previous.optedIn) {
            const refCode = getStoredAmbassadorRef();
            if (refCode) {
              // L'utilisateur est venu via un lien ambassadeur, créditer l'ambassadeur
              creditAmbassadorForNotification(refCode);
            }

            // Afficher le modal de sélection de zone si pas encore fait
            if (!hasSelectedZone()) {
              // Petit délai pour laisser la notification de bienvenue s'afficher
              setTimeout(() => {
                setShowZoneModal(true);
              }, 1500);
            }
          }
        });

        // Vérifier si l'utilisateur est déjà abonné au premier chargement
        const checkInitialSubscription = async () => {
          const isSubscribed = OneSignal.User.PushSubscription.optedIn;
          const alreadyCredited = localStorage.getItem(NOTIF_CREDITED_KEY);
          const refCode = getStoredAmbassadorRef();

          // Créditer l'ambassadeur si nécessaire
          if (isSubscribed && refCode && !alreadyCredited) {
            creditAmbassadorForNotification(refCode);
          }

          // Demander la zone si l'utilisateur est abonné mais n'a pas encore choisi
          if (isSubscribed && !hasSelectedZone()) {
            setShowZoneModal(true);
          }
        };
        checkInitialSubscription();

      }).catch((err) => {
        // Ignorer les erreurs de domaine en dev
        if (err?.message?.includes("Can only be used on")) {
          console.log("OneSignal: Domain not configured, skipping");
        } else {
          console.error("OneSignal init error:", err);
        }
      });
    }).catch(() => {
      console.log("OneSignal: Failed to load module");
    });
  }, []);

  const handleZoneSelected = (
    zoneId: string,
    zoneName: string,
    city: string,
    countryCode: string
  ) => {
    setOneSignalZoneTags(zoneId, zoneName, city, countryCode);
    setShowZoneModal(false);
  };

  return (
    <ZoneSelectionModal
      isOpen={showZoneModal}
      onClose={() => setShowZoneModal(false)}
      onZoneSelected={handleZoneSelected}
    />
  );
}
