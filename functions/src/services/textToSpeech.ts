import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { logger } from "firebase-functions";
import { writeFile } from "fs/promises";
import { AnnouncementDoc } from "../types";

const client = new TextToSpeechClient();

/**
 * Génère le script de voix-off pour une annonce
 */
export function createVoiceoverScript(announcement: AnnouncementDoc): string {
  const childGender = announcement.childGender === "M" ? "Garçon" : "Fille";
  const dateStr = formatDateForSpeech(announcement.lastSeenAt.toDate());

  const script = `
    Alerte. Enfant disparu.
    ${announcement.childName}, ${announcement.childAge} ans.
    ${childGender}.

    Vu pour la dernière fois, ${announcement.lastSeenPlace}.
    Le ${dateStr}.

    ${announcement.distinctiveSign ? `Signe distinctif: ${announcement.distinctiveSign}.` : ""}

    Si vous l'avez vu, signalez immédiatement.
    Sur enfent disparu point b f.

    Chaque partage compte.
  `.trim();

  return script;
}

/**
 * Génère un fichier audio MP3 à partir d'un texte
 */
export async function generateVoiceover(
  text: string,
  outputPath: string
): Promise<string> {
  try {
    logger.info("Generating voiceover", { textLength: text.length });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: "fr-FR",
        name: "fr-FR-Wavenet-A", // Voix féminine de haute qualité
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.95,    // Légèrement plus lent pour clarté
        pitch: -2.0,           // Ton légèrement plus grave (sérieux)
        volumeGainDb: 2.0,     // Volume augmenté
        effectsProfileId: ["handset-class-device"], // Optimisé pour mobile
      },
    });

    if (!response.audioContent) {
      throw new Error("No audio content received from TTS");
    }

    // Sauvegarder le fichier audio
    await writeFile(outputPath, response.audioContent, "binary");

    logger.info("Voiceover generated successfully", { outputPath });
    return outputPath;
  } catch (error) {
    logger.error("Voiceover generation failed", { error });
    throw error;
  }
}

/**
 * Génère la voix-off complète pour une annonce
 */
export async function generateAnnouncementVoiceover(
  announcement: AnnouncementDoc,
  outputPath: string
): Promise<string> {
  const script = createVoiceoverScript(announcement);
  return generateVoiceover(script, outputPath);
}

/**
 * Formate une date pour la prononciation
 */
function formatDateForSpeech(date: Date): string {
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName} ${day} ${month}, à ${hours} heures ${minutes}`;
}
