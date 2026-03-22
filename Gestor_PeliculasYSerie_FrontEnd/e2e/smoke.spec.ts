import { test, expect } from '@playwright/test';

/**
 * Pruebas que no dependen del backend: solo shell de la SPA y rutas estáticas.
 */
test.describe('Smoke — UI sin API', () => {
  test('redirección / → Home muestra secciones principales', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/Home$/);
    await expect(page.getByRole('heading', { name: 'Acción' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Géneros' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mejor valoradas' })).toBeVisible();
  });

  test('footer muestra marca FilmScore', async ({ page }) => {
    await page.goto('/Home');
    await expect(page.locator('footer.footer')).toContainText('FilmScore');
  });

  test('login muestra formulario de acceso', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByPlaceholder(/alberto/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Regístrate' })).toBeVisible();
  });

  test('registro muestra formulario', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Crear cuenta' })).toBeVisible();
  });

  test('listado Películas muestra título de página', async ({ page }) => {
    await page.goto('/movies');
    await expect(page.getByRole('heading', { name: 'Películas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Anterior' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeVisible();
  });
});
