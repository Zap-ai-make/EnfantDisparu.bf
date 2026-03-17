import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type for Firestore Timestamp (has toDate method)
type FirestoreTimestamp = { toDate: () => Date; seconds: number; nanoseconds: number };

// Helper to convert various date formats (Date, string, Firestore Timestamp) to Date
function toDate(date: Date | string | FirestoreTimestamp | unknown): Date {
  if (!date) return new Date();

  // Firestore Timestamp object
  if (typeof date === "object" && date !== null && "toDate" in date && typeof (date as FirestoreTimestamp).toDate === "function") {
    return (date as FirestoreTimestamp).toDate();
  }

  // Already a Date
  if (date instanceof Date) {
    return date;
  }

  // String or number
  return new Date(date as string | number);
}

export function timeAgo(date: Date | string | unknown): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true, locale: fr });
}

export function formatDate(date: Date | string | unknown): string {
  return format(toDate(date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr });
}

export function formatDateShort(date: Date | string | unknown): string {
  return format(toDate(date), "dd/MM/yyyy", { locale: fr });
}

export function urgencyLevel(createdAt: Date | string | unknown): "critical" | "urgent" | "active" {
  const hours = (Date.now() - toDate(createdAt).getTime()) / 1000 / 3600;
  if (hours < 6) return "critical";
  if (hours < 24) return "urgent";
  return "active";
}

/**
 * Retourne le temps écoulé sous forme "Xh XXmin" ou "X jours"
 */
export function elapsedTime(date: Date | string | unknown): string {
  const ms = Date.now() - toDate(date).getTime();
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (hours >= 1) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes} min`;
}

export function urgencyLabel(level: ReturnType<typeof urgencyLevel>): string {
  return { critical: "CRITIQUE", urgent: "URGENT", active: "EN COURS" }[level];
}

export function urgencyColor(level: ReturnType<typeof urgencyLevel>): string {
  return {
    critical: "bg-red-600 text-white",
    urgent: "bg-orange-500 text-white",
    active: "bg-gray-500 text-white",
  }[level];
}

export function formatPhone(phone: string): string {
  // +22670123456 → +226 70 12 34 56
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("226")) {
    return `+226 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

export function buildShareText(announcement: {
  childName: string;
  childAge: number;
  zoneName: string;
  lastSeenPlace: string;
  shortCode: string;
}): string {
  return `🚨 ENFANT DISPARU — URGENT\n\n${announcement.childName}, ${announcement.childAge} ans\n📍 Dernière vue : ${announcement.lastSeenPlace} (${announcement.zoneName})\n\nSi vous l'avez vu(e), contactez sa famille :\n🔗 enfantdisparu.bf/annonce/${announcement.shortCode}\n\n⚡ Partagez — chaque partage peut sauver une vie.`;
}

/**
 * Formate un nombre avec notation K pour les milliers
 * @example formatK(1500) → "1.5k"
 * @example formatK(500) → "500"
 */
export function formatK(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString("fr-FR");
}
