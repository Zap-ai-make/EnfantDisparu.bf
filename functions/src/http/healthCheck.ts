import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config";

/**
 * Endpoint de health check pour vérifier que les services sont opérationnels
 * Usage: GET /healthCheck
 *
 * Retourne:
 * - 200 OK si tout fonctionne
 * - 503 Service Unavailable si Firestore est inaccessible
 */
export const healthCheck = onRequest(
  {
    region: "europe-west1",
    cors: true, // Permettre les checks depuis n'importe où
  },
  async (req, res) => {
    const startTime = Date.now();

    try {
      // Test de connexion Firestore
      const firestoreStart = Date.now();
      await db.collection("_health").doc("check").set({
        lastCheck: new Date().toISOString(),
        timestamp: Date.now(),
      });
      const firestoreLatency = Date.now() - firestoreStart;

      const totalLatency = Date.now() - startTime;

      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          firestore: {
            status: "connected",
            latencyMs: firestoreLatency,
          },
        },
        totalLatencyMs: totalLatency,
        version: process.env.K_REVISION || "unknown",
        region: "europe-west1",
      });
    } catch (error) {
      const totalLatency = Date.now() - startTime;

      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        totalLatencyMs: totalLatency,
      });
    }
  }
);
