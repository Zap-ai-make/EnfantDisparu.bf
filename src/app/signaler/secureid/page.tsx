"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface SecureIDProfile {
  id: string;
  childName: string;
  childAge: number;
  childGender: "M" | "F";
  childPhotoURL?: string;
  parentPhone: string;
  braceletId?: string;
}

export default function SignalerSecureIDPage() {
  const router = useRouter();
  const [braceletCode, setBraceletCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<SecureIDProfile | null>(null);

  const handleLookup = async () => {
    if (!braceletCode.trim()) {
      toast.error("Entrez votre code bracelet");
      return;
    }

    setLoading(true);
    try {
      // Appeler l'API pour rechercher le bracelet
      const response = await fetch("/api/secureid/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ braceletCode: braceletCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Debug info en console pour diagnostic
        if (data.debug) {
          console.log("SecureID Debug:", data.debug);
        }
        toast.error(data.error || "Code bracelet introuvable");
        setLoading(false);
        return;
      }

      if (!data.success || !data.profile) {
        toast.error("Profil introuvable");
        setLoading(false);
        return;
      }

      setProfile({
        id: data.profile.id,
        childName: data.profile.childName,
        childAge: data.profile.childAge,
        childGender: data.profile.childGender,
        childPhotoURL: data.profile.childPhotoURL,
        parentPhone: data.profile.parentPhone,
        braceletId: data.profile.braceletId,
      });

      toast.success("Profil trouvé !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!profile) return;

    // Stocker les données sensibles en sessionStorage (pas dans l'URL)
    const sessionKey = `secureid_${Date.now()}`;
    sessionStorage.setItem(sessionKey, JSON.stringify({
      profileId: profile.id,
      braceletId: profile.braceletId || "",
      name: profile.childName,
      age: profile.childAge,
      gender: profile.childGender,
      phone: profile.parentPhone,
      photo: profile.childPhotoURL || "",
    }));

    // Passer seulement la clé de session dans l'URL
    router.push(`/signaler/secureid/form?key=${sessionKey}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <Link href="/signaler" className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au formulaire standard
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-gray-900">Alerte SecureID</h1>
            <p className="text-gray-500 text-sm">Pré-remplir avec votre profil enfant</p>
          </div>
        </div>
      </div>

      {!profile ? (
        /* Étape 1: Entrer le code bracelet */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-2">
              Entrez votre code bracelet
            </h2>
            <p className="text-sm text-gray-500">
              Le code se trouve sur le bracelet SecureID de votre enfant (ex: BF-0123)
            </p>
          </div>

          <div>
            <input
              type="text"
              value={braceletCode}
              onChange={(e) => setBraceletCode(e.target.value.toUpperCase())}
              placeholder="BF-0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400"
              maxLength={10}
            />
          </div>

          <button
            onClick={handleLookup}
            disabled={loading || !braceletCode.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Recherche...
              </>
            ) : (
              "Rechercher le profil"
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Vous n&apos;avez pas de bracelet SecureID ?{" "}
            <a
              href="https://secureid-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 underline"
            >
              En commander un
            </a>
          </p>
        </div>
      ) : (
        /* Étape 2: Confirmer le profil */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">Profil trouvé</h2>
            <button
              onClick={() => setProfile(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Changer
            </button>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-4">
            {profile.childPhotoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.childPhotoURL}
                alt={profile.childName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-emerald-200 rounded-xl flex items-center justify-center text-2xl">
                {profile.childGender === "M" ? "👦" : "👧"}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-lg">{profile.childName}</p>
              <p className="text-gray-600 text-sm">
                {profile.childAge} ans · {profile.childGender === "M" ? "Garçon" : "Fille"}
              </p>
              <p className="text-emerald-600 text-xs font-medium mt-1">
                🛡 SecureID: {profile.braceletId}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
            <p className="font-medium mb-1">⚠️ Vérifiez les informations</p>
            <p>
              Vous allez créer une alerte pour {profile.childName}.
              Assurez-vous qu&apos;il/elle est bien disparu(e) avant de continuer.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
          >
            🚨 Continuer l&apos;alerte
          </button>
        </div>
      )}

      {/* Avantages SecureID */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">✨ Avantages SecureID</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            Profil enfant pré-rempli automatiquement
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            Photo de qualité déjà enregistrée
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            Dernière position GPS connue (si bracelet actif)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            Alertes prioritaires sur tous les canaux
          </li>
        </ul>
      </div>
    </div>
  );
}
