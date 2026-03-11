import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndexComponent } from './features/index/index.component';
import { MovieDetailComponent } from './features/movies/movie-detail/movie-detail.component';
import { MoviesPageComponent } from './features/movies/movies-page/movies-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { adminGuard } from './core/admin.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth.guard';


export const routes: Routes = [
    {
        path: 'directores',
        loadComponent: () =>
            import('./features/directores/lista-directores/lista-directores.component')
                .then(m => m.ListaDirectoresComponent),
        canActivate: [adminGuard]
    },
    { path: '', redirectTo: 'Home', pathMatch: 'full' },
    {
        path: 'registrar-director',
        loadComponent: () =>
            import('./features/directores/registrar-director/registrar-director.component')
                .then(m => m.RegistrarDirectorComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'actualizar-director/:id',
        loadComponent: () =>
            import('./features/directores/actualizar-director/actualizar-director.component')
                .then(m => m.ActualizarDirectorComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'empleado-detalles/:id',
        loadComponent: () =>
            import('./features/directores/actualizar-director/actualizar-director.component')
                .then(m => m.ActualizarDirectorComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'generos',
        loadComponent: () =>
            import('./features/generos/lista-generos/lista-generos.component')
                .then(m => m.ListaGenerosComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'registrar-genero',
        loadComponent: () =>
            import('./features/generos/registrar-generos/registrar-generos.component')
                .then(m => m.RegistrarGenerosComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'actualizar-genero/:id',
        loadComponent: () =>
            import('./features/generos/actualizar-generos/actualizar-generos.component')
                .then(m => m.ActualizarGenerosComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'genero-detalles/:id',
        loadComponent: () =>
            import('./features/generos/actualizar-generos/actualizar-generos.component')
                .then(m => m.ActualizarGenerosComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'peliculas',
        loadComponent: () =>
            import('./features/movies/lista-movies/lista-movies.component')
                .then(m => m.ListaMoviesComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'registrar-pelicula',
        loadComponent: () =>
            import('./features/movies/registrar-movies/registrar-movies.component')
                .then(m => m.RegistrarMoviesComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'actualizar-pelicula/:id',
        loadComponent: () =>
            import('./features/movies/actualizar-movies/actualizar-movies.component')
                .then(m => m.ActualizarMoviesComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'pelicula-detalles/:id',
        loadComponent: () =>
            import('./features/movies/actualizar-movies/actualizar-movies.component')
                .then(m => m.ActualizarMoviesComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'tmdb-import',
        loadComponent: () =>
            import('./features/movies/tmdb-import/tmdb-import.component')
                .then(m => m.TmdbImportComponent),
        canActivate: [adminGuard]
    },
    { path: 'movies/:id', component: MovieDetailComponent },
    { path: 'movies', component: MoviesPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'account',
        loadComponent: () => import('./features/auth/account/account.component').then(m => m.AccountComponent),
        canActivate: [authGuard]
    },
    {
        path: 'users',
        loadComponent: () => import('./features/users/lista-users/lista-users.component')
            .then(m => m.ListaUsersComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'account/edit',
        loadComponent: () =>
            import('./features/auth/account-edit/account-edit.component')
                .then(m => m.AccountEditComponent),
        canActivate: [authGuard]
    },
    {
        path: 'account/password',
        loadComponent: () =>
            import('./features/auth/account-password/account-password.component')
                .then(m => m.AccountPasswordComponent),
        canActivate: [authGuard]
    },

    { path: 'Home', component: IndexComponent },
    { path: '**', redirectTo: 'Home' }
];
