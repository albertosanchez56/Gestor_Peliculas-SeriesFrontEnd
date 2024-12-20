import { RouterModule, Routes } from '@angular/router';
import { ListaDirectoresComponent } from './features/directores/lista-directores/lista-directores.component';
import { NgModule } from '@angular/core';
import { RegistrarDirectorComponent } from './features/directores/registrar-director/registrar-director.component';
import { ActualizarDirectorComponent } from './features/directores/actualizar-director/actualizar-director.component';
import { IndexComponent } from './features/index/index.component';
import { ListaGenerosComponent } from './features/generos/lista-generos/lista-generos.component';
import { RegistrarGenerosComponent } from './features/generos/registrar-generos/registrar-generos.component';
import { ActualizarGenerosComponent } from './features/generos/actualizar-generos/actualizar-generos.component';

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
    {path : 'Home', component: IndexComponent}
];
