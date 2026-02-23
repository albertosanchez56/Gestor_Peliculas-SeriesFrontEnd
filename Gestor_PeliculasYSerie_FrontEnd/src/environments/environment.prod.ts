/**
 * Configuración del entorno de producción.
 * Sustituye a environment.ts cuando se ejecuta: ng build --configuration=production
 * Ajusta apiBaseUrl a la URL de tu API en producción.
 */
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:9090', // Cambiar por la URL de tu API en producción (ej. https://api.tudominio.com)
};
