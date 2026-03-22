import { test, expect } from '@playwright/test';

/**
 * Navegación y búsqueda sin requerir datos en la API (solo enrutado).
 */
test.describe('Navegación', () => {
  test('desde Home: Inicio y Películas en el menú', async ({ page }) => {
    await page.goto('/Home');
    await page.getByRole('button', { name: 'Películas' }).click();
    await expect(page).toHaveURL(/\/movies$/);
    await page.getByRole('button', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/Home$/);
  });

  test('búsqueda en cabecera navega a /movies con query', async ({ page }) => {
    await page.goto('/Home');
    await page.locator('.search-button').click();
    await page.locator('.search-input').fill('matrix');
    await page.locator('.search-go').click();
    await expect(page).toHaveURL(/\/movies/);
    const url = new URL(page.url());
    expect(url.searchParams.get('q')).toBe('matrix');
  });
});
