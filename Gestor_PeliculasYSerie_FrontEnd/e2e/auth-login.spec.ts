import { test, expect } from '@playwright/test';
import { isMovieApiAvailable } from './helpers/api';

/**
 * Login E2E opcional: define E2E_USER y E2E_PASSWORD (usuario real en tu entorno local).
 * Sin variables, el test se omite.
 */
test.describe('Login con credenciales (opcional)', () => {
  test('flujo login → Home y sesión reflejada en nav', async ({ page, request }) => {
    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;
    test.skip(!user || !password, 'Definir E2E_USER y E2E_PASSWORD para ejecutar login E2E');

    const apiOk = await isMovieApiAvailable(request);
    test.skip(!apiOk, 'Backend no disponible');

    await page.goto('/login');
    await page.getByPlaceholder(/alberto/).fill(user!);
    await page.locator('input[type="password"]').fill(password!);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/Home$/i, { timeout: 20_000 });
    await expect(page.getByRole('button', { name: /Mi cuenta/ })).toBeVisible({ timeout: 10_000 });
  });
});
