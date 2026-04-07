import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Custom Zones ───────────────────────────────────────────────────────────

export interface CustomZone {
  id: string;
  countryCode: string;
  countryName: string;
  city: string;
  neighborhood: string;
  createdAt: Date;
  usageCount: number;
}

/**
 * Sauvegarde une zone personnalisée (ville/quartier entré manuellement)
 * Incrémente le compteur d'utilisation si elle existe déjà
 */
export async function saveCustomZone(
  countryCode: string,
  countryName: string,
  city: string,
  neighborhood: string
): Promise<void> {
  const customZonesRef = collection(db, "customZones");

  // Créer un ID unique basé sur la localisation
  const zoneId = `${countryCode.toLowerCase()}_${city.toLowerCase()}_${neighborhood.toLowerCase()}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9_]/g, "_"); // Replace special chars with underscore

  const zoneRef = doc(customZonesRef, zoneId);
  const zoneSnap = await getDoc(zoneRef);

  if (zoneSnap.exists()) {
    // Incrémenter le compteur d'utilisation
    await updateDoc(zoneRef, {
      usageCount: increment(1),
    });
  } else {
    // Créer une nouvelle zone personnalisée
    await setDoc(zoneRef, {
      countryCode,
      countryName,
      city,
      neighborhood,
      createdAt: serverTimestamp(),
      usageCount: 1,
    });
  }
}

/**
 * Récupère toutes les zones personnalisées, triées par utilisation
 */
export async function getCustomZones(): Promise<CustomZone[]> {
  const customZonesRef = collection(db, "customZones");
  const q = query(customZonesRef, orderBy("usageCount", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      countryCode: data.countryCode,
      countryName: data.countryName,
      city: data.city,
      neighborhood: data.neighborhood,
      createdAt: data.createdAt?.toDate() || new Date(),
      usageCount: data.usageCount || 0,
    };
  });
}

/**
 * Récupère les zones personnalisées pour un pays spécifique
 */
export async function getCustomZonesByCountry(countryCode: string): Promise<CustomZone[]> {
  const customZonesRef = collection(db, "customZones");
  const q = query(
    customZonesRef,
    where("countryCode", "==", countryCode),
    orderBy("usageCount", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      countryCode: data.countryCode,
      countryName: data.countryName,
      city: data.city,
      neighborhood: data.neighborhood,
      createdAt: data.createdAt?.toDate() || new Date(),
      usageCount: data.usageCount || 0,
    };
  });
}
