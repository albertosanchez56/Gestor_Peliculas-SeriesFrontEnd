import { defineConfig, devices } from '@playwright/test';

/**
 * E2E FilmScore — requiere Node y Chromium (instalar: npx playwright install chromium).
 * El front usa por defecto API en http://localhost:9090 (ver environment.ts).
 * Las pruebas marcadas con dependencia de API se omiten si el Gateway no responde.
 *
 * Nota: process.env se accede con ['CI'] por noPropertyAccessFromIndexSignature en tsconfig.
 */
const isCi = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : undefined,
  reporter: isCi ? 'line' : [['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isCi ? 'off' : 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx ng serve --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !isCi,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
