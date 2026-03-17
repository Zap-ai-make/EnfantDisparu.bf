import type { Metadata } from "next";
import { getAnnouncementByShortCode } from "@/lib/firestore";
import { AnnonceClient } from "./AnnonceClient";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shortCode } = await params;

  try {
    const announcement = await getAnnouncementByShortCode(shortCode);

    if (!announcement) {
      return {
        title: "Annonce introuvable | EnfantDisparu.bf",
        description: "Cette annonce n'existe pas ou a été supprimée.",
      };
    }

    const isFound = announcement.type === "found";
    const statusText = isFound ? "Enfant Trouvé" : "Enfant Disparu";
    const emoji = isFound ? "🙋" : "🚨";

    const title = `${emoji} ${announcement.childName}, ${announcement.childAge} ans - ${statusText}`;
    const description = `${announcement.zoneName} • ${announcement.description.slice(0, 100)}${announcement.description.length > 100 ? "..." : ""}`;

    // Utiliser l'image de la carte d'alerte si disponible, sinon la photo de l'enfant
    const ogImage = announcement.alertCardURL || announcement.childPhotoURL;

    return {
      title: `${title} | EnfantDisparu.bf`,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        siteName: "EnfantDisparu.bf",
        locale: "fr_BF",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `Alerte ${announcement.shortCode} - ${announcement.childName}`,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return {
      title: "Annonce | EnfantDisparu.bf",
      description: "Consultez cette annonce sur EnfantDisparu.bf",
    };
  }
}

export default async function AnnoncePage({ params }: PageProps) {
  const { shortCode } = await params;
  return <AnnonceClient shortCode={shortCode} />;
}
