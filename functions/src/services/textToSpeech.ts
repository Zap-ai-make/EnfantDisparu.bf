import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { logger } from "firebase-functions";
import { writeFile } from "fs/promises";
import { AnnouncementDoc } from "../types";

// Lazy initialization pour éviter les timeouts au déploiement
let client: TextToSpeechClient | null = null;

function getClient(): TextToSpeechClient {
  if (!client) {
    client = new TextToSpeechClient();
  }
  return client;
}

/**
 * Génère le script de voix-off pour une annonce avec SSML
 * SSML permet d'ajouter des pauses dramatiques et de l'emphase
 */
export function createVoiceoverScript(announcement: AnnouncementDoc): string {
  const childGender = announcement.childGender === "M" ? "un garçon" : "une fille";
  const pronounCap = announcement.childGender === "M" ? "Il" : "Elle";
  const dateStr = formatDateForSpeech(announcement.lastSeenAt.toDate());
  const isFound = announcement.type === "found";

  // Script adapté selon le type d'annonce (disparu ou trouvé)
  let script: string;

  if (isFound) {
    script = `<speak>
    <emphasis level="strong">Enfant trouvé. Cherche sa famille.</emphasis>
    <break time="800ms"/>

    ${announcement.childName}. <break time="500ms"/> ${childGender} de ${announcement.childAge} ans.
    <break time="800ms"/>

    ${pronounCap} a été trouvé <break time="300ms"/>
    à ${announcement.lastSeenPlace}. <break time="500ms"/>
    Le ${dateStr}.
    <break time="1s"/>

    ${announcement.distinctiveSign ? `<prosody rate="slow">${pronounCap} présente un signe distinctif: ${announcement.distinctiveSign}.</prosody><break time="800ms"/>` : ""}

    <prosody pitch="+1st">Si vous reconnaissez cet enfant,</prosody> <break time="500ms"/>
    <emphasis level="strong">signalez immédiatement</emphasis> <break time="300ms"/>
    sur enfant disparu point b f.
    <break time="1s"/>

    <prosody rate="85%" pitch="-1st">Chaque partage compte. Aidez-nous à réunir ${announcement.childName} avec sa famille.</prosody>
  </speak>`.trim();
  } else {
    script = `<speak>
    <emphasis level="strong">Alerte enfant disparu.</emphasis>
    <break time="800ms"/>

    ${announcement.childName}. <break time="500ms"/> ${childGender} de ${announcement.childAge} ans.
    <break time="800ms"/>

    ${pronounCap} a été vu <break time="300ms"/> pour la dernière fois <break time="300ms"/>
    à ${announcement.lastSeenPlace}. <break time="500ms"/>
    Le ${dateStr}.
    <break time="1s"/>

    ${announcement.distinctiveSign ? `<prosody rate="slow">${pronounCap} présente un signe distinctif: ${announcement.distinctiveSign}.</prosody><break time="800ms"/>` : ""}

    <prosody pitch="+1st">Si vous avez des informations,</prosody> <break time="500ms"/>
    <emphasis level="strong">signalez immédiatement</emphasis> <break time="300ms"/>
    sur enfant disparu point b f.
    <break time="1s"/>

    <prosody rate="85%" pitch="-1st">Chaque partage compte. Aidez-nous à retrouver ${announcement.childName}.</prosody>
  </speak>`.trim();
  }

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

    const [response] = await getClient().synthesizeSpeech({
      input: { ssml: text }, // Utiliser SSML au lieu de text pour pauses et emphase
      voice: {
        languageCode: "fr-FR",
        name: "fr-FR-Neural2-A", // Voix Neural2 plus naturelle et captivante
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.92,    // Plus lent pour clarté dramatique
        pitch: -1.0,           // Moins grave, plus naturel
        volumeGainDb: 3.0,     // Volume augmenté pour meilleure présence
        effectsProfileId: ["large-home-entertainment-class-device"], // Meilleure qualité audio
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
