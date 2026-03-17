"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronLeft, Shield, MapPin, Clock, Upload } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/lib/firebase";
import { getDefaultStats, maskPhone } from "@/lib/firestore";
import { ZonePicker } from "@/components/ZonePicker";
import { cn } from "@/lib/utils";

interface FormData {
  zoneId: string;
  zoneName: string;
  lastSeenPlace: string;
  lastSeenAt: string;
  description: string;
  distinctiveSign?: string;
}

function SecureIDFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  // Données SecureID depuis les paramètres URL
  const profileId = searchParams.get("profileId") || "";
  const braceletId = searchParams.get("braceletId") || "";
  const childName = searchParams.get("name") || "";
  const childAge = parseInt(searchParams.get("age") || "0");
  const childGender = (searchParams.get("gender") || "M") as "M" | "F";
  const parentPhone = searchParams.get("phone") || "";
  const childPhotoURL = searchParams.get("photo") || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Vérifier que les données SecureID sont présentes
  useEffect(() => {
    if (!profileId || !childName) {
      toast.error("Données SecureID manquantes");
      router.push("/signaler/secureid");
    }
  }, [profileId, childName, router]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Générer les codes (cryptographiquement sécurisés)
      const shortCode = `EPB-${nanoid(8)}`;
      const tokenArray = new Uint8Array(16);
      crypto.getRandomValues(tokenArray);
      const secretToken = Array.from(tokenArray, (b) => b.toString(16).padStart(2, "0")).join("");

      // Masquer le téléphone
      const parentPhoneDisplay = maskPhone(parentPhone);

      // Nom de la zone (fourni par ZonePicker)
      const zoneName = data.zoneName || data.zoneId;

      // Créer l'annonce avec les données SecureID
      const docRef = await addDoc(collection(db, "announcements"), {
        shortCode,
        secretToken,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        type: "missing",

        childName,
        childAge,
        childGender,
        childPhotoURL,
        description: data.description.trim(),
        distinctiveSign: data.distinctiveSign?.trim() || "",

        zoneId: data.zoneId,
        zoneName,
        lastSeenPlace: data.lastSeenPlace.trim(),
        lastSeenAt: new Date(data.lastSeenAt),

        parentPhone,
        parentPhoneDisplay,

        // Marqué comme SecureID
        isSecureID: true,
        linkedProfileId: profileId,
        linkedBraceletId: braceletId || null,
        lastGpsLat: null,
        lastGpsLng: null,

        stats: getDefaultStats(),

        remindersSent: 0,
        nextReminderAt: null,
        resolvedAt: null,
        alertCardURL: null,
      });

      router.push(`/confirmation?code=${shortCode}&token=${secretToken}&id=${docRef.id}&secureid=true`);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec infos SecureID */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          {childPhotoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={childPhotoURL}
              alt={childName}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-emerald-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {childGender === "M" ? "👦" : "👧"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">SecureID</span>
            </div>
            <p className="font-bold text-gray-900 text-lg">{childName}</p>
            <p className="text-gray-600 text-sm">
              {childAge} ans · {childGender === "M" ? "Garçon" : "Fille"}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire simplifié */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Où et quand ?
          </h2>

          {/* Zone */}
          <input
            type="hidden"
            {...register("zoneId", { required: "Sélectionnez le pays, la ville et le quartier" })}
          />
          <input type="hidden" {...register("zoneName")} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pays / Ville / Quartier <span className="text-red-500">*</span>
            </label>
            <ZonePicker
              onChange={(zoneId, zoneName) => {
                setValue("zoneId", zoneId, { shouldValidate: true });
                setValue("zoneName", zoneName);
              }}
              error={errors.zoneId?.message}
            />
          </div>

          {/* Lieu précis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lieu précis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ex: Marché Rood-Woko, côté légumes"
              className={cn(
                "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors",
                errors.lastSeenPlace
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-red-500"
              )}
              {...register("lastSeenPlace", { required: "Le lieu est requis" })}
            />
            {errors.lastSeenPlace && (
              <p className="text-red-500 text-xs mt-1">{errors.lastSeenPlace.message}</p>
            )}
          </div>

          {/* Heure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Heure de disparition <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className={cn(
                "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors",
                errors.lastSeenAt
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-red-500"
              )}
              {...register("lastSeenAt", { required: "L'heure est requise" })}
            />
            {errors.lastSeenAt && (
              <p className="text-red-500 text-xs mt-1">{errors.lastSeenAt.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description (vêtements, etc.) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Décrivez les vêtements portés, la coiffure..."
              className={cn(
                "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors",
                errors.description
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-red-500"
              )}
              {...register("description", { required: "La description est requise" })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Signe distinctif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Signe distinctif (optionnel)
            </label>
            <input
              type="text"
              placeholder="Cicatrice, grain de beauté..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              {...register("distinctiveSign")}
            />
          </div>

          {/* Diffusion */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
            <p className="font-medium">🚨 L&apos;alerte sera diffusée sur :</p>
            <p>📘 Page Facebook EnfantDisparu.bf</p>
            <p>💬 Chaîne WhatsApp EnfantDisparu.bf</p>
            <p>🔔 Membres abonnés de votre secteur</p>
            <p className="text-emerald-600 font-medium">⚡ Priorité SecureID activée</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/signaler/secureid"
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-bold text-lg transition-colors"
            >
              {submitting ? "Publication..." : "🚨 Publier l'alerte"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function SecureIDFormPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
          <div className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
        </div>
      }
    >
      <SecureIDFormContent />
    </Suspense>
  );
}
