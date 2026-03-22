"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, MapPin, User, CheckCircle, ChevronDown, Calendar, Cat } from "lucide-react";
import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY } from "@/lib/zones";
import { cn } from "@/lib/utils";
import { getAmbassadorCount } from "@/lib/firestore";
import { getStoredAmbassadorRef } from "@/components/AmbassadorRefTracker";
import type { SubmitApplicationResult, CatAnswer } from "@/types/ambassador";

type Step = 1 | 2 | 3 | 4;

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function DevenirAmbassadeurPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ambassadorCount, setAmbassadorCount] = useState<number | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("BFA");
  const [city, setCity] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [catAnswer, setCatAnswer] = useState<CatAnswer | "">("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    getAmbassadorCount().then(setAmbassadorCount).catch(() => {});
  }, []);

  const canProceedStep1 = firstName.trim().length >= 2 && lastName.trim().length >= 2 && phone.trim().length >= 8;
  const canProceedStep2 = zoneId !== "";
  const canProceedStep3 = birthDay !== "" && birthMonth !== "" && birthYear !== "" && catAnswer !== "";
  const canSubmit = acceptedTerms;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      // Use API route for local dev, Cloud Function for production
      const apiUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL
        ? `${process.env.NEXT_PUBLIC_FUNCTIONS_URL}/submitAmbassadorApplication`
        : "/api/ambassador/submit";

      // Get referral code if any
      const referredBy = getStoredAmbassadorRef();

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          countryCode,
          city,
          zoneId,
          dateOfBirth: {
            day: parseInt(birthDay, 10),
            month: parseInt(birthMonth, 10),
            year: parseInt(birthYear, 10),
          },
          catAnswer,
          honeypot,
          referredBy, // Inclure le code de parrainage si présent
        }),
      });

      const result: SubmitApplicationResult = await response.json();

      if (result.success && result.refCode) {
        router.push(`/ambassadeur-confirme?ref=${result.refCode}`);
      } else {
        switch (result.error) {
          case "rate_limited":
            setError("Trop de tentatives. Veuillez réessayer dans une heure.");
            break;
          case "too_young":
            setError("Vous devez avoir au moins 20 ans pour devenir ambassadeur.");
            break;
          case "duplicate_pending":
            setError("Une candidature est déjà en cours de traitement pour ce numéro.");
            break;
          case "duplicate_approved":
            setError("Ce numéro est déjà associé à un compte ambassadeur actif.");
            break;
          case "duplicate_rejected":
            setError("Une précédente candidature avec ce numéro a été refusée.");
            break;
          default:
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Devenir Ambassadeur</h1>
            <p className="text-amber-100 text-sm">Protégez les enfants de votre quartier</p>
          </div>
        </div>
        <p className="text-sm text-amber-100 leading-relaxed">
          Les ambassadeurs sont des citoyens engagés qui aident à retrouver les enfants disparus
          en partageant les alertes et en mobilisant leur communauté.
        </p>
      </div>

      {/* Avantages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">Ce que font les ambassadeurs</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">📲</span>
            <span className="text-gray-600">Reçoivent une notification immédiate quand un enfant disparaît près de chez eux</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">🔗</span>
            <span className="text-gray-600">Partagent leur lien unique pour recruter d&apos;autres ambassadeurs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">📊</span>
            <span className="text-gray-600">Suivent leur impact sur un tableau de bord personnel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">🏆</span>
            <span className="text-gray-600">Font partie d&apos;un réseau de citoyens engagés</span>
          </li>
        </ul>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 px-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= s ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
              )}
            >
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div className={cn("flex-1 h-1 rounded-full", step > s ? "bg-amber-500" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Honeypot (hidden) */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Step 1: Identité */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              Vos informations
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amadou"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Konaté"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro WhatsApp
              </label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-gray-100 rounded-xl text-sm text-gray-600">
                  +226
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="70 00 00 00"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Vous recevrez un lien d&apos;accès à votre tableau de bord
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2: Zone */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Votre zone principale
            </h3>

            <p className="text-sm text-gray-500">
              Choisissez le quartier où vous habitez ou travaillez. Vous pourrez ajouter jusqu&apos;à 5 zones après validation.
            </p>

            {/* Pays */}
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => { setCountryCode(e.target.value); setCity(""); setZoneId(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Ville */}
            <div className="relative">
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setZoneId(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
              >
                <option value="">Sélectionnez une ville</option>
                {(CITIES_BY_COUNTRY[countryCode] ?? []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Quartier */}
            {city && (
              <div className="relative">
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                >
                  <option value="">Sélectionnez un quartier</option>
                  {(ZONES_BY_CITY[city] ?? []).map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date de naissance + Question chat */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Informations complémentaires
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="">Jour</option>
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="">Mois</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="">Année</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Vous devez avoir au moins 20 ans
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Cat className="w-4 h-4 text-amber-500" />
                Avez-vous un chat ?
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Question de vérification anti-bot
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["yes", "no", "maybe"] as const).map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => setCatAnswer(answer)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium transition-colors border",
                      catAnswer === answer
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                    )}
                  >
                    {answer === "yes" ? "Oui" : answer === "no" ? "Non" : "Peut-être"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              Finaliser votre candidature
            </h3>

            {/* Récapitulatif */}
            <div className="bg-amber-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-amber-900">Récapitulatif</p>
              <div className="text-sm text-amber-700 space-y-1">
                <p><span className="text-amber-500">👤</span> {firstName} {lastName}</p>
                <p><span className="text-amber-500">📱</span> +226 {phone}</p>
                <p><span className="text-amber-500">📍</span> {ZONES_BY_CITY[city]?.find(z => z.id === zoneId)?.name}, {city}</p>
                <p><span className="text-amber-500">🎂</span> {birthDay}/{birthMonth}/{birthYear}</p>
              </div>
            </div>

            {/* Engagement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">
                Je m&apos;engage à répondre rapidement aux alertes, à respecter la vie privée des familles,
                et à agir de manière responsable dans l&apos;intérêt des enfants.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {submitting ? "Envoi..." : "Envoyer ma candidature"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
        <p className="text-2xl font-extrabold text-amber-500">
          {ambassadorCount !== null ? ambassadorCount : "..."}
        </p>
        <p className="text-xs text-gray-500">ambassadeurs actifs au Burkina Faso</p>
      </div>
    </div>
  );
}
