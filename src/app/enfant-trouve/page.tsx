"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Upload, ChevronRight, ChevronLeft, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { createFoundChildAnnouncement } from "@/lib/firestore";
import { ZonePicker } from "@/components/ZonePicker";
import { Field, inputClass } from "@/components/forms";
import { cn } from "@/lib/utils";

type FormData = {
  childPhotoFile: FileList;
  estimatedAge: number;
  childGender: "M" | "F";
  description: string;
  distinctiveSign?: string;
  zoneId: string;
  zoneName: string;
  foundPlace: string;
  foundAt: string;
  finderPhone: string;
  finderName?: string;
  childCanSpeak: boolean;
  childSaidName?: string;
};

const STEPS = ["L'enfant", "Où trouvé", "Votre contact"];

export default function EnfantTrouvePage() {
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

  const childCanSpeak = watch("childCanSpeak");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ["childPhotoFile", "estimatedAge", "childGender", "description"],
      ["zoneId", "foundPlace", "foundAt"],
      ["finderPhone"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const { shortCode, secretToken, docId } = await createFoundChildAnnouncement({
        childPhoto: data.childPhotoFile[0],
        estimatedAge: Number(data.estimatedAge),
        childGender: data.childGender,
        description: data.description,
        distinctiveSign: data.distinctiveSign ?? "",
        childSaidName: data.childSaidName,
        zoneId: data.zoneId,
        zoneName: data.zoneName,
        foundPlace: data.foundPlace,
        foundAt: data.foundAt,
        finderPhone: data.finderPhone,
        finderName: data.finderName,
      });

      router.push(`/confirmation-trouve?code=${shortCode}&token=${secretToken}&id=${docId}`);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
            🙋
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-xl mb-1">J&apos;ai trouvé un enfant</h1>
            <p className="text-green-100 text-sm">
              Aidez-nous à retrouver sa famille. Remplissez ce formulaire et nous diffuserons
              l&apos;information aux parents qui cherchent leur enfant.
            </p>
          </div>
        </div>
      </div>

      {/* Urgence */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">En cas d&apos;urgence</p>
            <p className="text-amber-700 text-xs mt-1">
              Si l&apos;enfant est en danger ou a besoin de soins, appelez d&apos;abord les secours
              (Police: 17 · Pompiers: 18) avant de remplir ce formulaire.
            </p>
          </div>
        </div>
      </div>

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
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-xs hidden sm:block", i === step ? "text-emerald-600 font-medium" : "text-gray-400")}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {/* ÉTAPE 1 — L'enfant */}
          {step === 0 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Description de l&apos;enfant</h2>

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de l&apos;enfant <span className="text-red-500">*</span>
                </label>
                <label className="cursor-pointer block">
                  {previewUrl ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Changer</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-400 transition-colors">
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

              {/* L'enfant peut-il parler ? */}
              <div className="bg-blue-50 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("childCanSpeak")}
                  />
                  <span className="text-sm text-blue-800">L&apos;enfant peut parler et a dit son nom</span>
                </label>
                {childCanSpeak && (
                  <input
                    type="text"
                    placeholder="Prénom dit par l'enfant"
                    className="mt-3 w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("childSaidName")}
                  />
                )}
              </div>

              {/* Âge estimé + Genre */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Âge estimé" required error={errors.estimatedAge?.message}>
                  <input
                    type="number"
                    min={0}
                    max={18}
                    placeholder="ex: 5"
                    className={inputClass(!!errors.estimatedAge, "emerald")}
                    {...register("estimatedAge", {
                      required: "Requis",
                      min: { value: 0, message: "Âge invalide" },
                      max: { value: 18, message: "Âge invalide" },
                    })}
                  />
                </Field>

                <Field label="Genre" required error={errors.childGender?.message}>
                  <select
                    className={inputClass(!!errors.childGender, "emerald")}
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
                  placeholder="Vêtements, coiffure, état de l'enfant..."
                  className={inputClass(!!errors.description, "emerald")}
                  {...register("description", { required: "La description est requise" })}
                />
              </Field>

              {/* Signe distinctif */}
              <Field label="Signe distinctif (optionnel)">
                <input
                  type="text"
                  placeholder="Cicatrice, grain de beauté..."
                  className={inputClass(false, "emerald")}
                  {...register("distinctiveSign")}
                />
              </Field>
            </>
          )}

          {/* ÉTAPE 2 — Localisation */}
          {step === 1 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Où l&apos;avez-vous trouvé ?</h2>

              <input type="hidden" {...register("zoneId", { required: "Sélectionnez la zone" })} />
              <input type="hidden" {...register("zoneName")} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Zone <span className="text-red-500">*</span>
                </label>
                <ZonePicker
                  onChange={(zoneId, zoneName) => {
                    setValue("zoneId", zoneId, { shouldValidate: true });
                    setValue("zoneName", zoneName);
                  }}
                  error={errors.zoneId?.message}
                />
              </div>

              <Field label="Lieu précis où vous l'avez trouvé" required error={errors.foundPlace?.message}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ex: Devant le marché central"
                    className={cn(inputClass(!!errors.foundPlace, "emerald"), "pl-10")}
                    {...register("foundPlace", { required: "Le lieu est requis" })}
                  />
                </div>
              </Field>

              <Field label="Date et heure" required error={errors.foundAt?.message}>
                <input
                  type="datetime-local"
                  className={inputClass(!!errors.foundAt, "emerald")}
                  {...register("foundAt", { required: "Requis" })}
                />
              </Field>
            </>
          )}

          {/* ÉTAPE 3 — Contact */}
          {step === 2 && (
            <>
              <h2 className="font-bold text-xl text-gray-900">Vos coordonnées</h2>

              <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700">
                <p className="font-medium mb-1">🙏 Merci pour votre geste</p>
                <p>
                  Vos coordonnées permettront aux parents de vous contacter.
                  Elles ne seront pas affichées publiquement.
                </p>
              </div>

              <Field label="Votre nom (optionnel)">
                <input
                  type="text"
                  placeholder="ex: Mamadou Ouedraogo"
                  className={inputClass(false, "emerald")}
                  {...register("finderName")}
                />
              </Field>

              <Field label="Votre numéro de téléphone" required error={errors.finderPhone?.message}>
                <input
                  type="tel"
                  placeholder="+226 70 XX XX XX"
                  className={inputClass(!!errors.finderPhone, "emerald")}
                  {...register("finderPhone", {
                    required: "Le numéro est requis",
                    pattern: {
                      value: /^\+?[0-9\s\-]{8,15}$/,
                      message: "Numéro invalide",
                    },
                  })}
                />
              </Field>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium">Cette annonce sera visible par :</p>
                <p>👨‍👩‍👧 Les parents qui cherchent leur enfant</p>
                <p>📘 Diffusée sur notre page Facebook</p>
                <p>💬 Partagée sur notre chaîne WhatsApp</p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 rounded-xl font-bold text-lg transition-colors"
              >
                {submitting ? "Publication en cours..." : "🙋 Publier l'annonce"}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Lien vers signaler disparu */}
      <div className="text-center">
        <Link href="/signaler" className="text-sm text-gray-500 hover:text-red-600">
          Vous cherchez votre enfant ? <span className="underline">Signaler un enfant disparu</span>
        </Link>
      </div>
    </div>
  );
}
