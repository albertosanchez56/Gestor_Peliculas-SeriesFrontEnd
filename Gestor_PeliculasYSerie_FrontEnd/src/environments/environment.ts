/**
 * Configuración del entorno de desarrollo.
 * La URL base del API (Gateway) se sustituye por la de producción al hacer build con --configuration=production.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:9090',
};
