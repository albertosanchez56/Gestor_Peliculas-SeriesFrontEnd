import type { APIRequestContext } from '@playwright/test';

/** URL del Gateway (mismo valor por defecto que environment.ts del front). */
export const defaultApiBaseUrl = (): string =>
  process.env.E2E_API_BASE_URL ?? 'http://localhost:9090';

/**
 * Indica si el movie-service responde vía Gateway (listado top-rated público).
 * Usado para omitir pruebas que necesitan datos reales.
 */
export async function isMovieApiAvailable(request: APIRequestContext): Promise<boolean> {
  try {
    const base = defaultApiBaseUrl().replace(/\/$/, '');
    const res = await request.get(`${base}/peliculas/top-rated?limit=1`, { timeout: 10_000 });
    return res.ok();
  } catch {
    return false;
  }
}
