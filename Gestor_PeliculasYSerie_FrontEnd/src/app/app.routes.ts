import { RouterModule, Routes } from '@angular/router';
import { ListaDirectoresComponent } from './features/directores/lista-directores/lista-directores.component';
import { NgModule } from '@angular/core';
import { RegistrarDirectorComponent } from './features/directores/registrar-director/registrar-director.component';
import { ActualizarDirectorComponent } from './features/directores/actualizar-director/actualizar-director.component';
import { IndexComponent } from './features/index/index.component';
import { ListaGenerosComponent } from './features/generos/lista-generos/lista-generos.component';
import { RegistrarGenerosComponent } from './features/generos/registrar-generos/registrar-generos.component';
import { ActualizarGenerosComponent } from './features/generos/actualizar-generos/actualizar-generos.component';
import { ListaMoviesComponent } from './features/movies/lista-movies/lista-movies.component';
import { RegistrarMoviesComponent } from './features/movies/registrar-movies/registrar-movies.component';
import { ActualizarMoviesComponent } from './features/movies/actualizar-movies/actualizar-movies.component';
import { TmdbImportComponent } from './features/movies/tmdb-import/tmdb-import.component';
import { MovieDetailComponent } from './features/movies/movie-detail/movie-detail.component';
import { MoviesPageComponent } from './features/movies/movies-page/movies-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { adminGuard } from './core/admin.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { AccountComponent } from './features/auth/account/account.component';
import { authGuard } from './core/auth.guard';


export const routes: Routes = [
    { path: 'directores', component: ListaDirectoresComponent, canActivate: [adminGuard] },
    { path: '', redirectTo: 'Home', pathMatch: 'full' },
    { path: 'registrar-director', component: RegistrarDirectorComponent },
    { path: 'actualizar-director/:id', component: ActualizarDirectorComponent },
    { path: 'empleado-detalles/:id', component: ActualizarDirectorComponent },
    { path: 'generos', component: ListaGenerosComponent, canActivate: [adminGuard] },
    { path: 'registrar-genero', component: RegistrarGenerosComponent },
    { path: 'actualizar-genero/:id', component: ActualizarGenerosComponent },
    { path: 'genero-detalles/:id', component: ActualizarGenerosComponent },
    { path: 'peliculas', component: ListaMoviesComponent, canActivate: [adminGuard] },
    { path: 'registrar-pelicula', component: RegistrarMoviesComponent },
    { path: 'actualizar-pelicula/:id', component: ActualizarMoviesComponent },
    { path: 'pelicula-detalles/:id', component: ActualizarMoviesComponent },
    { path: 'tmdb-import', component: TmdbImportComponent, canActivate: [adminGuard] },
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
        path: 'account',
        loadComponent: () =>
            import('./features/auth/account/account.component')
                .then(m => m.AccountComponent),
        canActivate: [authGuard]
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
