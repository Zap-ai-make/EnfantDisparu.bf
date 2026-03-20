"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { createAnnouncement } from "@/lib/firestore";
import { ZonePicker } from "@/components/ZonePicker";
import { Field, inputClass } from "@/components/forms";
import { cn } from "@/lib/utils";
import type { CreateAnnouncementInput } from "@/types/announcement";

type FormData = Omit<CreateAnnouncementInput, "childPhoto"> & {
  childPhotoFile: FileList;
  zoneName: string;
};

const STEPS = ["L'enfant", "Où & quand", "Votre contact"];

export default function SignalerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const watchPhoto = watch("childPhotoFile");

  // Prévisualisation photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ["childName", "childAge", "childGender", "childPhotoFile", "description"],
      ["zoneId", "lastSeenPlace", "lastSeenAt"],
      ["parentPhone"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const { shortCode, secretToken, docId } = await createAnnouncement({
        childName: data.childName,
        childAge: Number(data.childAge),
        childGender: data.childGender,
        childPhoto: data.childPhotoFile[0],
        description: data.description,
        distinctiveSign: data.distinctiveSign ?? "",
        zoneId: data.zoneId,
        zoneName: data.zoneName,
        lastSeenPlace: data.lastSeenPlace,
        lastSeenAt: data.lastSeenAt,
        parentPhone: data.parentPhone,
      });

      router.push(`/confirmation?code=${shortCode}&token=${secretToken}&id=${docId}`);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-xs hidden sm:block", i === step ? "text-red-600 font-medium" : "text-gray-400")}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-5">

          {/* ÉTAPE 1 — L'enfant */}
          {step === 0 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Informations sur l&apos;enfant</h2>

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de l&apos;enfant <span className="text-red-500">*</span>
                </label>
                <label className="cursor-pointer block">
                  {previewUrl ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-red-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Changer</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-red-400 transition-colors">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Ajouter photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...register("childPhotoFile", { required: "La photo est requise" })}
                    onChange={handlePhotoChange}
                  />
                </label>
                {errors.childPhotoFile && (
                  <p className="text-red-500 text-xs mt-1">{errors.childPhotoFile.message}</p>
                )}
              </div>

              {/* Nom */}
              <Field label="Prénom et nom" required error={errors.childName?.message}>
                <input
                  type="text"
                  placeholder="ex: Aminata Sawadogo"
                  className={inputClass(!!errors.childName)}
                  {...register("childName", { required: "Le nom est requis" })}
                />
              </Field>

              {/* Âge + Genre */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Âge" required error={errors.childAge?.message}>
                  <input
                    type="number"
                    min={0}
                    max={18}
                    placeholder="6"
                    className={inputClass(!!errors.childAge)}
                    {...register("childAge", {
                      required: "Requis",
                      min: { value: 0, message: "Âge invalide" },
                      max: { value: 18, message: "Âge invalide" },
                    })}
                  />
                </Field>

                <Field label="Genre" required error={errors.childGender?.message}>
                  <select
                    className={inputClass(!!errors.childGender)}
                    {...register("childGender", { required: "Requis" })}
                  >
                    <option value="">—</option>
                    <option value="F">Fille</option>
                    <option value="M">Garçon</option>
                  </select>
                </Field>
              </div>

              {/* Description */}
              <Field label="Description physique" required error={errors.description?.message}>
                <textarea
                  rows={3}
                  placeholder="Vêtements portés, coiffure, couleur de peau..."
                  className={inputClass(!!errors.description)}
                  {...register("description", { required: "La description est requise" })}
                />
              </Field>

              {/* Signe distinctif */}
              <Field label="Signe distinctif (optionnel)">
                <input
                  type="text"
                  placeholder="Cicatrice, grain de beauté, tatouage..."
                  className={inputClass(false)}
                  {...register("distinctiveSign")}
                />
              </Field>
            </>
          )}

          {/* ÉTAPE 2 — Localisation */}
          {step === 1 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Où et quand ?</h2>

              {/* Zone — champ caché pour la validation react-hook-form */}
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

              <Field label="Lieu précis de la dernière vue" required error={errors.lastSeenPlace?.message}>
                <input
                  type="text"
                  placeholder="ex: Marché Rood-Woko, côté légumes"
                  className={inputClass(!!errors.lastSeenPlace)}
                  {...register("lastSeenPlace", { required: "Le lieu est requis" })}
                />
              </Field>

              <Field label="Heure de disparition" required error={errors.lastSeenAt?.message}>
                <input
                  type="datetime-local"
                  className={inputClass(!!errors.lastSeenAt)}
                  {...register("lastSeenAt", { required: "L'heure est requise" })}
                />
              </Field>
            </>
          )}

          {/* ÉTAPE 3 — Contact */}
          {step === 2 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Votre contact</h2>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">🔒 Votre numéro est protégé</p>
                <p>Il ne sera jamais affiché publiquement. Nous vous enverrons le lien de gestion de votre annonce sur ce numéro WhatsApp.</p>
              </div>

              <Field label="Numéro WhatsApp" required error={errors.parentPhone?.message}>
                <input
                  type="tel"
                  placeholder="+226 70 XX XX XX"
                  className={inputClass(!!errors.parentPhone)}
                  {...register("parentPhone", {
                    required: "Le numéro est requis",
                    pattern: {
                      value: /^\+?[0-9\s\-]{8,15}$/,
                      message: "Numéro invalide",
                    },
                  })}
                />
              </Field>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium">Votre annonce sera diffusée sur :</p>
                <p>📘 Page Facebook EnfantDisparu.bf</p>
                <p>💬 Chaîne WhatsApp EnfantDisparu.bf</p>
                <p>🔔 Membres abonnés de votre secteur</p>
              </div>
            </>
          )}

          {/* Navigation - larger touch targets */}
          <div className="flex gap-3 pt-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center justify-center gap-1 px-4 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 font-medium text-sm min-w-[100px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3.5 rounded-xl font-semibold transition-colors active:scale-[0.98]"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-400 text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-colors active:scale-[0.98]"
              >
                {submitting ? "Publication..." : "🚨 Publier l'annonce"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
