"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, MapPin, Phone, User, CheckCircle, ChevronDown } from "lucide-react";
import { registerVigie } from "@/lib/firestore";
import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY } from "@/lib/zones";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export default function DevenirVigiePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("BFA");
  const [city, setCity] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [motivation, setMotivation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const canProceedStep1 = name.trim().length >= 2 && phone.trim().length >= 8;
  const canProceedStep2 = zoneId !== "";
  const canSubmit = acceptedTerms;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      await registerVigie({
        name: name.trim(),
        phone: phone.trim(),
        zoneId,
        motivation: motivation.trim(),
      });
      router.push("/vigie-confirmee");
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Devenir Vigie</h1>
            <p className="text-blue-100 text-sm">Protégez les enfants de votre quartier</p>
          </div>
        </div>
        <p className="text-sm text-blue-100 leading-relaxed">
          Les vigies sont des bénévoles qui reçoivent des alertes en temps réel quand un enfant
          disparaît dans leur zone et aident à le retrouver rapidement.
        </p>
      </div>

      {/* Avantages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">Ce que font les vigies</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">📲</span>
            <span className="text-gray-600">Reçoivent une notification immédiate quand un enfant disparaît près de chez eux</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">👀</span>
            <span className="text-gray-600">Surveillent leur quartier et signalent toute observation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">🤝</span>
            <span className="text-gray-600">Partagent les alertes dans leurs groupes WhatsApp locaux</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">🏆</span>
            <span className="text-gray-600">Font partie d&apos;un réseau de citoyens engagés</span>
          </li>
        </ul>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              )}
            >
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={cn("flex-1 h-1 rounded-full", step > s ? "bg-blue-600" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Step 1: Identité */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Vos informations
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre nom ou pseudonyme
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amadou K."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Vous recevrez les alertes par WhatsApp
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2: Zone */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Votre zone de surveillance
            </h3>

            <p className="text-sm text-gray-500">
              Choisissez le quartier où vous habitez ou travaillez. Vous serez alerté quand un enfant
              disparaît dans cette zone.
            </p>

            {/* Pays */}
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => { setCountryCode(e.target.value); setCity(""); setZoneId(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Finaliser votre inscription
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pourquoi voulez-vous devenir vigie ? (optionnel)
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Ex: Je veux aider à protéger les enfants de mon quartier..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Récapitulatif */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-blue-900">Récapitulatif</p>
              <div className="text-sm text-blue-700 space-y-1">
                <p><span className="text-blue-500">👤</span> {name}</p>
                <p><span className="text-blue-500">📱</span> +226 {phone}</p>
                <p><span className="text-blue-500">📍</span> {ZONES_BY_CITY[city]?.find(z => z.id === zoneId)?.name}, {city}</p>
              </div>
            </div>

            {/* Engagement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {submitting ? "Inscription..." : "Devenir Vigie"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
        <p className="text-2xl font-extrabold text-blue-600">127</p>
        <p className="text-xs text-gray-500">vigies actives au Burkina Faso</p>
      </div>
    </div>
  );
}
