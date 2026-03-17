import { logger } from "firebase-functions";

// Timeout par défaut: 10 secondes
const DEFAULT_TIMEOUT_MS = 10000;

// Configuration retry
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000;

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Fetch avec timeout via AbortController
 * Empêche les appels API de bloquer indéfiniment
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  shouldRetry?: (error: Error, response?: Response) => boolean;
}

/**
 * Fetch avec retry et backoff exponentiel
 * Utile pour les APIs qui peuvent avoir des erreurs transitoires
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithTimeoutOptions & RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    initialDelayMs = DEFAULT_INITIAL_DELAY_MS,
    shouldRetry = defaultShouldRetry,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);

      // Vérifier si on doit retry sur certains status codes
      if (!response.ok && shouldRetry(new Error(`HTTP ${response.status}`), response)) {
        lastResponse = response;
        if (attempt < maxRetries) {
          const delay = initialDelayMs * Math.pow(2, attempt);
          logger.warn(`Retrying request (attempt ${attempt + 1}/${maxRetries})`, {
            url,
            status: response.status,
            delayMs: delay,
          });
          await sleep(delay);
          continue;
        }
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries && shouldRetry(lastError)) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        logger.warn(`Retrying request after error (attempt ${attempt + 1}/${maxRetries})`, {
          url,
          error: lastError.message,
          delayMs: delay,
        });
        await sleep(delay);
        continue;
      }

      throw lastError;
    }
  }

  // Si on arrive ici, on a épuisé les retries
  if (lastResponse) {
    return lastResponse;
  }
  throw lastError || new Error("Max retries exceeded");
}

/**
 * Détermine si une erreur/réponse doit déclencher un retry
 */
function defaultShouldRetry(error: Error, response?: Response): boolean {
  // Retry sur timeout
  if (error.message.includes("timeout")) {
    return true;
  }

  // Retry sur erreurs réseau
  if (error.message.includes("network") || error.message.includes("ECONNRESET")) {
    return true;
  }

  // Retry sur certains status codes
  if (response) {
    const status = response.status;
    // 429 Too Many Requests, 500+ Server errors (sauf 501 Not Implemented)
    return status === 429 || (status >= 500 && status !== 501);
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
