import { logger } from "firebase-functions";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { storage, db, COLLECTIONS, BASE_URL } from "../config";
import { AnnouncementDoc } from "../types";
import { Timestamp } from "firebase-admin/firestore";
import QRCode from "qrcode";
import sharp from "sharp";

// Format portrait pour mobile (téléchargement et partage) - PRIMARY
const MOBILE_CARD_WIDTH = 1080;
const MOBILE_CARD_HEIGHT = 1350;

const COLORS = {
  redPrimary: "#DC2626",
  redDark: "#991B1B",
  greenPrimary: "#16A34A",
  greenDark: "#15803D",
  white: "#FFFFFF",
  black: "#1F2937",
  gray: "#6B7280",
};

// Cache de la police pour éviter de la re-télécharger à chaque génération
let cachedFontData: ArrayBuffer | null = null;

async function getFontData(): Promise<ArrayBuffer> {
  if (cachedFontData) {
    logger.info("Using cached font data (performance optimization)");
    return cachedFontData;
  }

  logger.info("Fetching font data (first time)");
  const fontResponse = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
  );
  cachedFontData = await fontResponse.arrayBuffer();
  logger.info("Font loaded and cached", { size: cachedFontData.byteLength });
  return cachedFontData;
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Satori ne supporte pas webp - convertir en JPEG
    if (contentType.includes("webp")) {
      logger.info("Converting webp to jpeg for satori compatibility");
      const jpegBuffer = await sharp(Buffer.from(buffer))
        .jpeg({ quality: 85 })
        .toBuffer();
      const base64 = jpegBuffer.toString("base64");
      return "data:image/jpeg;base64," + base64;
    }

    const base64 = Buffer.from(buffer).toString("base64");
    return "data:" + contentType + ";base64," + base64;
  } catch (error) {
    logger.warn("Failed to fetch image", { url, error });
    return null;
  }
}

function formatDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function generateQRCodeBase64(url: string, size: number): Promise<string> {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 1,
    color: {
      dark: COLORS.redPrimary,
      light: COLORS.white,
    },
  });
}

// Crée l'élément de la carte au format portrait (mobile-first)
function buildMobileCardElement(
  announcement: AnnouncementDoc,
  childPhotoBase64: string | null,
  qrCodeBase64: string,
  disappearanceDate: string,
  announcementUrl: string
) {
  const isFound = announcement.type === "found";
  const alertTitle = isFound ? "ENFANT TROUVE" : "ENFANT DISPARU";
  const dateLabel = isFound ? "TROUVE LE" : "DISPARU LE";
  const genderText = announcement.childGender === "M" ? "Garcon" : "Fille";
  const genderLetter = announcement.childGender === "M" ? "M" : "F";

  // Photo ou placeholder
  const photoElement = childPhotoBase64
    ? {
        type: "img",
        props: {
          src: childPhotoBase64,
          width: 400,
          height: 400,
          style: {
            borderRadius: 20,
            border: "8px solid " + COLORS.redPrimary,
            objectFit: "cover",
          },
        },
      }
    : {
        type: "div",
        props: {
          style: {
            width: 400,
            height: 400,
            backgroundColor: "#F3F4F6",
            borderRadius: 20,
            border: "8px solid " + COLORS.redPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
            color: COLORS.gray,
          },
          children: genderLetter,
        },
      };

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
      },
      children: [
        // Header
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 40px",
              backgroundColor: COLORS.redPrimary,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 36, fontWeight: 700, color: COLORS.white },
                  children: "EnfentDisparu.bf",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    color: COLORS.white,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "10px 20px",
                    borderRadius: 10,
                  },
                  children: "ALERTE " + announcement.shortCode,
                },
              },
            ],
          },
        },
        // Alert title band
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              backgroundColor: COLORS.redDark,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    color: COLORS.white,
                    letterSpacing: 4,
                  },
                  children: alertTitle,
                },
              },
            ],
          },
        },
        // Body - Photo centré
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "40px",
              gap: 30,
            },
            children: [
              // Photo
              photoElement,
              // Nom
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 56,
                    fontWeight: 700,
                    color: COLORS.black,
                    textAlign: "center",
                  },
                  children: announcement.childName.toUpperCase(),
                },
              },
              // Age et genre
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 32,
                    color: COLORS.gray,
                    textAlign: "center",
                  },
                  children: announcement.childAge + " ans - " + genderText,
                },
              },
              // Zone
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 28,
                    color: COLORS.black,
                    textAlign: "center",
                    marginTop: 10,
                  },
                  children: announcement.zoneName,
                },
              },
              // Date
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    color: COLORS.white,
                    fontWeight: 700,
                    backgroundColor: COLORS.redPrimary,
                    padding: "12px 24px",
                    borderRadius: 12,
                    marginTop: 10,
                  },
                  children: dateLabel + " " + disappearanceDate,
                },
              },
            ],
          },
        },
        // Footer avec QR
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 40px",
              borderTop: "4px solid " + COLORS.redPrimary,
              backgroundColor: "#FAFAFA",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 28,
                          fontWeight: 700,
                          color: COLORS.black,
                        },
                        children: "VU CET ENFANT?",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 22,
                          color: COLORS.redPrimary,
                          fontWeight: 700,
                        },
                        children: "enfentdisparu.bf/" + announcement.shortCode,
                      },
                    },
                  ],
                },
              },
              {
                type: "img",
                props: {
                  src: qrCodeBase64,
                  width: 100,
                  height: 100,
                },
              },
            ],
          },
        },
        // Bottom bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              padding: 16,
              backgroundColor: COLORS.redPrimary,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 18, color: COLORS.white, fontWeight: 700 },
                  children: "EnfentDisparu.bf - Retrouvons-les ensemble - Burkina Faso",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function generateAlertCard(
  announcement: AnnouncementDoc,
  docId: string
): Promise<string | null> {
  try {
    logger.info("Starting alert card generation (mobile format)", {
      docId,
      shortCode: announcement.shortCode,
    });

    // Charger la police (avec cache pour performance)
    const fontData = await getFontData();

    const baseUrl = BASE_URL.value();
    const announcementUrl = baseUrl + "/annonce/" + announcement.shortCode;

    // Photo de l'enfant
    const childPhotoBase64 = announcement.childPhotoURL
      ? await fetchImageAsBase64(announcement.childPhotoURL)
      : null;
    logger.info("Photo loaded", { hasPhoto: !!childPhotoBase64 });

    // QR code (plus grand pour mobile)
    const qrCodeBase64 = await generateQRCodeBase64(announcementUrl, 120);
    logger.info("QR code generated");

    // Données
    const disappearanceDate = formatDate(
      announcement.lastSeenAt || announcement.createdAt
    );

    logger.info("Creating mobile card SVG with satori");

    const element = buildMobileCardElement(
      announcement,
      childPhotoBase64,
      qrCodeBase64,
      disappearanceDate,
      announcementUrl
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = await satori(element as any, {
      width: MOBILE_CARD_WIDTH,
      height: MOBILE_CARD_HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    });

    logger.info("SVG created", { svgLength: svg.length });

    const resvg = new Resvg(svg, {
      background: COLORS.white,
      fitTo: { mode: "width", value: MOBILE_CARD_WIDTH },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    logger.info("PNG created", { size: pngBuffer.length });

    const bucket = storage.bucket();
    const fileName = "alert-cards/" + docId + ".png";
    const file = bucket.file(fileName);

    await file.save(pngBuffer, {
      metadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000",
      },
    });

    await file.makePublic();

    const publicUrl = "https://storage.googleapis.com/" + bucket.name + "/" + fileName;

    await db.collection(COLLECTIONS.ANNOUNCEMENTS).doc(docId).update({
      alertCardURL: publicUrl,
    });

    logger.info("Alert card generated (mobile format)", { docId, publicUrl });
    return publicUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error("Alert card generation failed", {
      docId,
      errorMessage,
      errorStack,
    });
    return null;
  }
}

// ─── Carte de Retrouvailles (enfant retrouvé) ──────────────────────────────────

function buildResolutionCardElement(
  announcement: AnnouncementDoc,
  childPhotoBase64: string | null,
  resolvedDate: string
) {
  const genderLetter = announcement.childGender === "M" ? "M" : "F";

  // Photo ou placeholder
  const photoElement = childPhotoBase64
    ? {
        type: "img",
        props: {
          src: childPhotoBase64,
          width: 350,
          height: 350,
          style: {
            borderRadius: 20,
            border: "8px solid " + COLORS.greenPrimary,
            objectFit: "cover",
          },
        },
      }
    : {
        type: "div",
        props: {
          style: {
            width: 350,
            height: 350,
            backgroundColor: "#F3F4F6",
            borderRadius: 20,
            border: "8px solid " + COLORS.greenPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 100,
            color: COLORS.gray,
          },
          children: genderLetter,
        },
      };

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
      },
      children: [
        // Header vert
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 40px",
              backgroundColor: COLORS.greenPrimary,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 36, fontWeight: 700, color: COLORS.white },
                  children: "EnfentDisparu.bf",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    color: COLORS.white,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "10px 20px",
                    borderRadius: 10,
                  },
                  children: "BONNE NOUVELLE!",
                },
              },
            ],
          },
        },
        // Title band
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              backgroundColor: COLORS.greenDark,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 48,
                    fontWeight: 700,
                    color: COLORS.white,
                    letterSpacing: 4,
                  },
                  children: "ENFANT RETROUVE",
                },
              },
            ],
          },
        },
        // Body
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "40px",
              gap: 24,
            },
            children: [
              // Emoji celebration
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 64,
                    textAlign: "center",
                  },
                  children: "🎉✨",
                },
              },
              // Photo
              photoElement,
              // Nom
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 52,
                    fontWeight: 700,
                    color: COLORS.black,
                    textAlign: "center",
                  },
                  children: announcement.childName.toUpperCase(),
                },
              },
              // Message
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 28,
                    color: COLORS.greenPrimary,
                    textAlign: "center",
                    fontWeight: 700,
                  },
                  children: "A ETE RETROUVE(E) SAIN(E) ET SAUF(VE)!",
                },
              },
              // Zone
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    color: COLORS.gray,
                    textAlign: "center",
                  },
                  children: announcement.zoneName,
                },
              },
              // Date retrouvé
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    color: COLORS.white,
                    fontWeight: 700,
                    backgroundColor: COLORS.greenPrimary,
                    padding: "12px 24px",
                    borderRadius: 12,
                    marginTop: 10,
                  },
                  children: "RETROUVE LE " + resolvedDate,
                },
              },
            ],
          },
        },
        // Footer
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "24px 40px",
              borderTop: "4px solid " + COLORS.greenPrimary,
              backgroundColor: "#FAFAFA",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLORS.greenPrimary,
                    textAlign: "center",
                  },
                  children: "MERCI A TOUS POUR VOS PARTAGES!",
                },
              },
            ],
          },
        },
        // Bottom bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              padding: 16,
              backgroundColor: COLORS.greenPrimary,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 18, color: COLORS.white, fontWeight: 700 },
                  children: "EnfentDisparu.bf - Retrouvons-les ensemble - Burkina Faso",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * Génère une carte de retrouvailles (enfant retrouvé)
 * Couleur verte pour la célébration
 */
export async function generateResolutionCard(
  announcement: AnnouncementDoc,
  docId: string
): Promise<string | null> {
  try {
    logger.info("Starting resolution card generation", {
      docId,
      shortCode: announcement.shortCode,
    });

    // Charger la police
    const fontResponse = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
    );
    const fontData = await fontResponse.arrayBuffer();

    // Photo de l'enfant
    const childPhotoBase64 = announcement.childPhotoURL
      ? await fetchImageAsBase64(announcement.childPhotoURL)
      : null;

    // Date de résolution
    const resolvedDate = formatDate(Timestamp.now());

    logger.info("Creating resolution card SVG");

    const element = buildResolutionCardElement(
      announcement,
      childPhotoBase64,
      resolvedDate
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = await satori(element as any, {
      width: MOBILE_CARD_WIDTH,
      height: MOBILE_CARD_HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const resvg = new Resvg(svg, {
      background: COLORS.white,
      fitTo: { mode: "width", value: MOBILE_CARD_WIDTH },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    logger.info("Resolution PNG created", { size: pngBuffer.length });

    const bucket = storage.bucket();
    const fileName = "resolution-cards/" + docId + ".png";
    const file = bucket.file(fileName);

    await file.save(pngBuffer, {
      metadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000",
      },
    });

    await file.makePublic();

    const publicUrl = "https://storage.googleapis.com/" + bucket.name + "/" + fileName;

    // Stocker l'URL de la carte de résolution
    await db.collection(COLLECTIONS.ANNOUNCEMENTS).doc(docId).update({
      resolutionCardURL: publicUrl,
    });

    logger.info("Resolution card generated", { docId, publicUrl });
    return publicUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Resolution card generation failed", {
      docId,
      errorMessage,
    });
    return null;
  }
}
