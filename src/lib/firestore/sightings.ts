import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Sighting } from "@/types/announcement";

// ─── Signalements (Sightings) ────────────────────────────────────────────────

export async function createSighting(data: {
  announcementId: string;
  place: string;
  description: string;
  reporterPhone?: string;
  anonymous?: boolean;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "sightings"), {
    announcementId: data.announcementId,
    place: data.place.trim(),
    description: data.description.trim(),
    reporterPhone: data.reporterPhone || null,
    anonymous: data.anonymous ?? true,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToSightings(
  announcementId: string,
  callback: (sightings: Sighting[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "sightings"),
    where("announcementId", "==", announcementId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const sightings = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Sighting[];
    callback(sightings);
  });
}

export async function getSightingsForAnnouncement(
  announcementId: string
): Promise<Sighting[]> {
  const q = query(
    collection(db, "sightings"),
    where("announcementId", "==", announcementId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as Sighting[];
}
