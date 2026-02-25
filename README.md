# FilmScore — Frontend

> SPA desarrollada en Angular para gestión de películas, usuarios y reseñas. Consume la API REST del backend de microservicios (Spring Boot) a través del API Gateway.

[![Angular 19](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)](https://angular.io/)
[![TypeScript 5.6](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![RxJS 7](https://img.shields.io/badge/RxJS-7-B7178C)](https://rxjs.dev/)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FilmScore Frontend (Angular)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│   │   Router    │    │   Guards    │    │ Interceptor │                │
│   │   (rutas)   │    │ auth/admin  │    │ Bearer JWT  │                │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                │
│          │                  │                  │                        │
│          ▼                  ▼                  ▼                        │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │                    Components (standalone)                │         │
│   │  Index · Movies · MovieDetail · Auth · Users · Genres ·   │         │
│   │  Directores · Account · Reviews (en MovieDetail)          │         │
│   └──────────────────────────┬───────────────────────────────┘         │
│                              │                                          │
│   ┌──────────────────────────┴───────────────────────────────┐         │
│   │                      Services                             │         │
│   │  AuthService · MovieService · ReviewService · UsersService │         │
│   │  GeneroService · DirectorService · TmdbService            │         │
│   └──────────────────────────┬───────────────────────────────┘         │
│                              │ HttpClient                               │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   API Gateway        │
                    │   localhost:9090     │
                    │   (Backend)          │
                    └──────────────────────┘
```

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Angular 19 |
| **Lenguaje** | TypeScript 5.6 |
| **Http** | HttpClient, RxJS |
| **Rutas** | Angular Router, lazy loading |
| **Formularios** | Reactive Forms, FormsModule |
| **SSR** | Angular Universal (Express) |
| **UI** | CSS3, SweetAlert2 |
| **Otros** | Slick Carousel, jQuery |

---

## Módulos y funcionalidades

### Autenticación
- Login y registro de usuarios
- Perfil de usuario (cuenta, editar, cambiar contraseña)
- Interceptor para enviar JWT en todas las peticiones
- Guards para rutas protegidas (`authGuard`, `adminGuard`)

### Películas
- Página principal con carrusel y destacadas
- Listado paginado con búsqueda
- Detalle de película con póster, sinopsis, trailer, reparto
- Reseñas por película: listado, estadísticas, formulario para crear reseña
- Importación desde TMDB (admin)
- CRUD completo (admin)

### Directores y géneros
- Listado, alta, edición (admin)

### Usuarios (admin)
- Listado de usuarios
- Gestión de roles y estados

---

## Modelos principales (interfaces)

### Auth
```
CurrentUser: id, username, displayName, role, email?
AuthResponse: accessToken, tokenType, expiresInSeconds, user
LoginRequest: login, password
RegisterRequest: username, email, displayName, password
```

### Películas
```
Movies: id, title, description, releaseDate, director, genres[],
        posterUrl, backdropUrl, trailerUrl, averageRating, ...
CastCredit: id, personName, characterName, profileUrl, orderIndex
```

### Reseñas
```
ReviewViewDTO: id, movieId, userId, displayName, rating, comment,
               containsSpoilers, edited, createdAt, updatedAt
MovieStatsDTO: averageUserRating, voteCount
CreateReviewRequest: movieId, rating, comment?, containsSpoilers
```

---

## Rutas principales

| Ruta | Componente | Protección |
|------|------------|------------|
| `/` | Redirige a Home | - |
| `/Home` | Index (inicio) | Público |
| `/movies` | Listado de películas | Público |
| `/movies/:id` | Detalle + reseñas | Público |
| `/login` | Login | Público |
| `/register` | Registro | Público |
| `/account` | Mi cuenta | authGuard |
| `/account/edit` | Editar perfil | authGuard |
| `/account/password` | Cambiar contraseña | authGuard |
| `/peliculas` | CRUD películas | adminGuard |
| `/generos` | CRUD géneros | adminGuard |
| `/directores` | CRUD directores | adminGuard |
| `/users` | Gestión usuarios | adminGuard |
| `/tmdb-import` | Importar TMDB | adminGuard |

---

## Cómo ejecutar

### Requisitos previos
- Node.js 18+
- npm 9+
- Backend en ejecución (API Gateway en `http://localhost:9090`)

### Instalación

```bash
# Navegar a la carpeta que contiene package.json
cd Gestor_PeliculasYSerie_FrontEnd

# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
npm start
# o: ng serve
```

Abrir en el navegador: `http://localhost:4200`

### Build de producción

```bash
npm run build
```

Salida en `dist/gestor-peliculas-yserie-front-end/`

### SSR (Server-Side Rendering)

```bash
npm run build
npm run serve:ssr:Gestor_PeliculasYSerie_FrontEnd
```

---

## Configuración

La URL base del API se configura por entorno:

- **Desarrollo:** `src/environments/environment.ts` → `apiBaseUrl: 'http://localhost:9090'`
- **Producción:** `src/environments/environment.prod.ts` → ajusta `apiBaseUrl` a la URL de tu API (ej. `https://api.tudominio.com`)

Al ejecutar `ng build --configuration=production`, se usa automáticamente `environment.prod.ts` (sustitución configurada en `angular.json`). Todos los servicios (Auth, Movie, Review, Genero, Director, Users, Tmdb) usan `environment.apiBaseUrl`.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                    # Auth, guards, interceptor
│   │   ├── auth.service.ts
│   │   ├── auth.models.ts
│   │   ├── auth.interceptor.ts
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── features/
│   │   ├── auth/                # Login, register, account
│   │   ├── movies/              # Listado, detalle, CRUD, TMDB
│   │   ├── review/              # ReviewService
│   │   ├── users/               # Gestión usuarios (admin)
│   │   ├── generos/             # CRUD géneros
│   │   ├── directores/          # CRUD directores
│   │   └── index/               # Página de inicio
│   ├── shared/
│   │   └── carousel/            # Componente carrusel
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── index.html
├── main.ts
├── main.server.ts
└── styles.css
```

---

## Testing

```bash
ng test
```

Ejecuta los tests con Karma/Jasmine. Algunos componentes incluyen `*.spec.ts` generados por Angular CLI.

---

## Próximos pasos

- Eliminar rutas duplicadas en `app.routes.ts` (p. ej. `account`)
- Proteger con `adminGuard` rutas de registro/edición de directores, géneros y películas
- Implementar funcionalidad del botón **favoritos** cuando el backend exponga el *favoritelist-service* (actualmente en desarrollo; ver README del backend).
- Añadir **manejo global de errores HTTP** (interceptor de errores)
- Migrar scripts jQuery/carousel a componentes Angular nativos si se requiere

---

## Repositorio del backend

[Backend — FilmScore API (Spring Boot + Microservicios)](https://github.com/albertosanchez56/Gestor_Peliculas-Series)

---

## Licencia

Proyecto de uso personal y educativo.