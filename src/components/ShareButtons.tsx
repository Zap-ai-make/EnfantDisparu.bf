"use client";

import { Download, Share2, Link2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  alertCardURL: string | null;
  shortCode: string;
  childName: string;
  childAge: number;
  childGender?: "M" | "F";
  zoneName: string;
  lastSeenAt: string; // Format DD/MM/YYYY
  type?: "missing" | "found";
}

export function ShareButtons({
  alertCardURL,
  shortCode,
  childName,
  childAge,
  childGender,
  zoneName,
  lastSeenAt,
  type = "missing",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isFound = type === "found";
  const statusText = isFound ? "TROUVÉ" : "DISPARU";
  const emoji = isFound ? "🙋" : "🚨";
  const genderEmoji = childGender === "M" ? "👦" : "👧";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://enfentdisparu.bf";
  const announcementUrl = typeof window !== "undefined"
    ? `${baseUrl}/annonce/${shortCode}`
    : "";

  // Template de texte personnalisé
  const shareText = `${emoji} ENFANT ${statusText} — URGENT

${genderEmoji} ${childName}, ${childAge} ans
📍 ${zoneName}
📅 ${isFound ? "Trouvé" : "Disparu"} le ${lastSeenAt}

⚡ Partagez — chaque partage peut sauver une vie.
🔗 ${announcementUrl}`;

  const handleDownload = async () => {
    if (!alertCardURL) {
      toast.error("Affiche non disponible");
      return;
    }

    setDownloading(true);
    try {
      // Fetch the image as blob to force download
      const response = await fetch(alertCardURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `alerte-enfant-${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Affiche téléchargée ! Partagez-la sur vos réseaux.");
    } catch {
      // Fallback: open in new tab
      window.open(alertCardURL, "_blank");
      toast.success("Affiche ouverte dans un nouvel onglet");
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFacebook = async () => {
    // Copier le texte d'abord car Facebook n'affiche plus le paramètre quote
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Texte copié ! Collez-le dans votre publication Facebook", {
        duration: 4000,
        icon: "📋",
      });
    } catch {
      // Continuer même si la copie échoue
    }

    // Ouvrir Facebook après un court délai pour que l'utilisateur voie le toast
    setTimeout(() => {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(announcementUrl)}`;
      window.open(facebookUrl, "_blank");
    }, 500);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${emoji} Alerte: ${childName}`,
          text: shareText,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Message copié ! Collez-le où vous voulez.");
      } catch {
        toast.error("Impossible de copier le message");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Message copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        ⚡ Partagez pour aider à retrouver {childName}
      </p>

      {/* Boutons principaux : WhatsApp et Facebook */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors font-semibold"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={handleFacebook}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-4 rounded-xl transition-colors font-semibold"
        >
          📘 Facebook
        </button>
      </div>

      {/* Boutons secondaires */}
      <div className="grid grid-cols-3 gap-2">
        {/* Télécharger */}
        <button
          onClick={handleDownload}
          disabled={!alertCardURL || downloading}
          className="flex flex-col items-center gap-1.5 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 py-3 px-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className={`w-5 h-5 ${downloading ? "animate-bounce" : ""}`} />
          <span className="text-xs font-medium">
            {downloading ? "..." : "Affiche"}
          </span>
        </button>

        {/* Partager (natif) */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1.5 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 py-3 px-2 rounded-xl transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs font-medium">Partager</span>
        </button>

        {/* Copier */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 py-3 px-2 rounded-xl transition-colors"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Link2 className="w-5 h-5" />
          )}
          <span className="text-xs font-medium">
            {copied ? "Copié !" : "Copier"}
          </span>
        </button>
      </div>

      {/* Instructions */}
      <div className="space-y-1">
        {alertCardURL && (
          <p className="text-xs text-gray-400 text-center">
            📥 Téléchargez l&apos;affiche puis joignez-la à votre message pour plus d&apos;impact
          </p>
        )}
        <p className="text-xs text-gray-400 text-center">
          📘 Facebook : le texte est copié automatiquement, collez-le dans votre publication
        </p>
      </div>
    </div>
  );
}
