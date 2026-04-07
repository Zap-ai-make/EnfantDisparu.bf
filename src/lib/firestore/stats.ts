import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Stats globales ──────────────────────────────────────────────────────────

export async function getGlobalStats(): Promise<{
  totalResolved: number;
  totalActive: number;
}> {
  const [resolvedSnap, activeSnap] = await Promise.all([
    getDocs(query(collection(db, "announcements"), where("status", "==", "resolved"))),
    getDocs(query(collection(db, "announcements"), where("status", "==", "active"))),
  ]);
  return {
    totalResolved: resolvedSnap.size,
    totalActive: activeSnap.size,
  };
}

// ─── Incrémenter les vues ────────────────────────────────────────────────────

export async function incrementPageViews(announcementId: string): Promise<void> {
  await updateDoc(doc(db, "announcements", announcementId), {
    "stats.pageViews": increment(1),
  });
}
