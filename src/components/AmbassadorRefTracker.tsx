"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const REF_COOKIE_NAME = "ambassador_ref";
const REF_COOKIE_EXPIRY_DAYS = 30;

export function AmbassadorRefTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref && /^AMB-[A-Z0-9]{4}$/.test(ref)) {
      // Stocker dans localStorage (principal)
      try {
        localStorage.setItem(REF_COOKIE_NAME, ref);
      } catch {
        // localStorage indisponible (mode privé, etc.)
      }

      // Stocker dans cookie (fallback)
      Cookies.set(REF_COOKIE_NAME, ref, {
        expires: REF_COOKIE_EXPIRY_DAYS,
        sameSite: "lax",
      });
    }
  }, [searchParams]);

  return null;
}

/**
 * Récupère le code ambassadeur stocké (localStorage prioritaire, cookie en fallback)
 */
export function getStoredAmbassadorRef(): string | null {
  // Essayer localStorage d'abord
  try {
    const fromStorage = localStorage.getItem(REF_COOKIE_NAME);
    if (fromStorage) return fromStorage;
  } catch {
    // localStorage indisponible
  }

  // Fallback sur cookie
  return Cookies.get(REF_COOKIE_NAME) || null;
}
