import { test, expect } from '@playwright/test';
import { isMovieApiAvailable } from './helpers/api';

/**
 * Flujos que necesitan Gateway + datos (películas en BD).
 * Si `localhost:9090` no responde, los tests se omiten (no fallan el job).
 */
test.describe('Journey con API (Gateway + películas)', () => {
  test.beforeEach(async ({ request }) => {
    const ok = await isMovieApiAvailable(request);
    test.skip(!ok, 'Backend no disponible (esperado en http://localhost:9090 — ver E2E_API_BASE_URL)');
  });

  test('Home: grid Acción — clic abre ficha de película', async ({ page }) => {
    await page.goto('/Home');
    const firstGrid = page.locator('.divsproductos a.product').first();
    await expect(firstGrid).toBeVisible({ timeout: 20_000 });
    await firstGrid.click();
    await expect(page).toHaveURL(/\/movies\/\d+/);
    await expect(page.locator('h1.movie-title')).toBeVisible();
  });

  test('Home: carrusel Mejor valoradas — clic navega al detalle', async ({ page }) => {
    await page.goto('/Home');
    const carousel = page.locator('app-carousel').first();
    await expect(carousel.getByRole('heading', { name: 'Mejor valoradas' })).toBeVisible();
    const slide = carousel.locator('.carousel-item .product').first();
    await expect(slide).toBeVisible({ timeout: 20_000 });
    await slide.click();
    await expect(page).toHaveURL(/\/movies\/\d+/);
    await expect(page.locator('h1.movie-title')).toBeVisible();
  });

  test('Listado /movies: clic en tarjeta abre detalle', async ({ page }) => {
    await page.goto('/movies');
    const card = page.locator('.divsproductos a.product').first();
    await expect(card).toBeVisible({ timeout: 20_000 });
    await card.click();
    await expect(page).toHaveURL(/\/movies\/\d+/);
    await expect(page.locator('h1.movie-title')).toBeVisible();
  });

  test('paginación: Siguiente cambia la query page si hay más páginas', async ({ page }) => {
    await page.goto('/movies');
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    await expect(nextBtn).toBeVisible();
    test.skip(await nextBtn.isDisabled(), 'Una sola página de resultados: no se puede probar Siguiente');
    await nextBtn.click();
    await expect(page).toHaveURL(/[?&]page=1(?:&|$)/);
  });
});
