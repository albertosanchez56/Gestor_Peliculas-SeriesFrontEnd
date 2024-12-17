import { RouterModule, Routes } from '@angular/router';
import { ListaDirectoresComponent } from './features/directores/lista-directores/lista-directores.component';
import { NgModule } from '@angular/core';
import { RegistrarDirectorComponent } from './features/directores/registrar-director/registrar-director.component';
import { ActualizarDirectorComponent } from './features/directores/actualizar-director/actualizar-director.component';
import { IndexComponent } from './features/index/index.component';

export const routes: Routes = [
    {path : 'directores', component:ListaDirectoresComponent},
    {path :'',redirectTo:'directores',pathMatch:'full'},
    {path : 'registrar-director', component : RegistrarDirectorComponent},
    {path : 'actualizar-director/:id', component: ActualizarDirectorComponent},
    {path : 'empleado-detalles/:id', component: ActualizarDirectorComponent},
    {path : 'Home', component: IndexComponent}
];
