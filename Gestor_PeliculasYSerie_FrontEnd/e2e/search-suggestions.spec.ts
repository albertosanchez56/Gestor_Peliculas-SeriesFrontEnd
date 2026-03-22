import { test, expect } from '@playwright/test';
import { isMovieApiAvailable } from './helpers/api';

/**
 * Búsqueda con sugerencias (autocomplete) — requiere API para resultados.
 */
test.describe('Búsqueda con sugerencias', () => {
  test.beforeEach(async ({ request }) => {
    const ok = await isMovieApiAvailable(request);
    test.skip(!ok, 'Backend no disponible');
  });

  test('al escribir aparecen sugerencias y al elegir una se abre el detalle', async ({ page }) => {
    await page.goto('/Home');
    await page.locator('.search-button').click();
    const input = page.locator('.search-input');
    await input.fill('a');
    const firstSugg = page.locator('.sugg-item').first();
    await expect(firstSugg).toBeVisible({ timeout: 15_000 });
    await firstSugg.click();
    await expect(page).toHaveURL(/\/movies\/\d+/);
    await expect(page.locator('h1.movie-title')).toBeVisible();
  });
});
