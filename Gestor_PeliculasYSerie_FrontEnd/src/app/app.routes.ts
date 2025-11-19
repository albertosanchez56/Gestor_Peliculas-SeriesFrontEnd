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

export const routes: Routes = [
    {path : 'directores', component:ListaDirectoresComponent},
    {path :'',redirectTo:'directores',pathMatch:'full'},
    {path : 'registrar-director', component : RegistrarDirectorComponent},
    {path : 'actualizar-director/:id', component: ActualizarDirectorComponent},
    {path : 'empleado-detalles/:id', component: ActualizarDirectorComponent},
    {path : 'generos', component:ListaGenerosComponent},
    {path : 'registrar-genero', component : RegistrarGenerosComponent},
    {path : 'actualizar-genero/:id', component: ActualizarGenerosComponent},
    {path : 'genero-detalles/:id', component: ActualizarGenerosComponent},
    {path : 'peliculas', component:ListaMoviesComponent},
    {path : 'registrar-pelicula', component : RegistrarMoviesComponent},
    {path : 'actualizar-pelicula/:id', component: ActualizarMoviesComponent},
    {path : 'pelicula-detalles/:id', component: ActualizarMoviesComponent},
    {path: 'tmdb-import', component: TmdbImportComponent },
    { path: 'movies/:id', component: MovieDetailComponent },
    { path: 'movies', component: MoviesPageComponent },
    {path : 'Home', component: IndexComponent}
];
