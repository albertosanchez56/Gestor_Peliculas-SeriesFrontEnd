# GestorPeliculasYSerieFrontEnd

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Ejecutar contra el backend Docker (FilmScore)

Este frontend está pensado para consumir el backend de microservicios `FilmScore` desplegado con Docker Compose.

1. **Levantar el backend con Docker**
   - Clona el repositorio del backend `Gestor_PeliculasYSeries_Microservicios`.
   - Sigue las instrucciones de su `README.md` para:
     - Crear el fichero `.env` a partir de `.env.docker.example`.
     - Ejecutar:
       ```bash
       docker compose up -d --build
       ```
     - Al final tendrás el Gateway disponible en `http://localhost:9090` y MySQL con datos de ejemplo precargados.

2. **Verificar la URL del API en el frontend**
   - En este proyecto, el cliente Angular usa los ficheros de entorno de Angular:
     - `src/environments/environment.ts` (desarrollo)
     - `src/environments/environment.prod.ts` (producción)
   - Asegúrate de que la propiedad `apiBaseUrl` apunta al Gateway:
     ```ts
     export const environment = {
       production: false,
       apiBaseUrl: 'http://localhost:9090'
     };
     ```

3. **Arrancar el frontend apuntando al backend Docker**
   - Instala dependencias si aún no lo has hecho:
     ```bash
     npm install
     ```
   - Arranca el servidor de desarrollo:
     ```bash
     ng serve
     ```
   - Abre `http://localhost:4200` en el navegador. Todas las llamadas HTTP del frontend irán contra `http://localhost:9090/...`, que es el Gateway de los microservicios en Docker.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
