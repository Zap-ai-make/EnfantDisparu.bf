"use client";

import { useEffect } from "react";

export function OneSignalInit() {
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

      OneSignal.init({
        appId,
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                delay: {
                  timeDelay: 3,
                  pageViews: 1,
                },
                text: {
                  actionMessage:
                    "Recevez les alertes d'enfants perdus dans votre secteur.",
                  acceptButton: "🔔 Activer les alertes",
                  cancelButton: "Plus tard",
                },
              },
            ],
          },
        },
        allowLocalhostAsSecureOrigin: true,
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

  return null;
}
