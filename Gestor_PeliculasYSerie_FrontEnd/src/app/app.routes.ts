import { RouterModule, Routes } from '@angular/router';
import { ListaDirectoresComponent } from './lista-directores/lista-directores.component';
import { NgModule } from '@angular/core';
import { RegistrarDirectorComponent } from './registrar-director/registrar-director.component';
import { ActualizarDirectorComponent } from './actualizar-director/actualizar-director.component';
import { IndexComponent } from './index/index.component';

export const routes: Routes = [
    {path : 'directores', component:ListaDirectoresComponent},
    {path :'',redirectTo:'directores',pathMatch:'full'},
    {path : 'registrar-director', component : RegistrarDirectorComponent},
    {path : 'actualizar-director/:id', component: ActualizarDirectorComponent},
    {path : 'empleado-detalles/:id', component: ActualizarDirectorComponent},
    {path : 'Home', component: IndexComponent}
];
