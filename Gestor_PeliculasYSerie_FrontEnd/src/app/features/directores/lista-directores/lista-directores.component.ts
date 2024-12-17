import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Director } from '../director';
import { DirectorService } from '../../../director.service';
import { Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-lista-directores',
  imports: [CommonModule],
  templateUrl: './lista-directores.component.html',
  styleUrl: './lista-directores.component.css'
})
export class ListaDirectoresComponent {

  directores:Director[];

  constructor(private directorServicio: DirectorService, private router:Router){}

  ngOnInit(): void{
    console.log('ListaDirectoresComponent cargado');
    this.obtenerEmpleados();
  }

  agregarDirector(){
    this.router.navigate(['registrar-director']);
  }

  actualizarDirector(id:number){
    this.router.navigate(['actualizar-director',id]);
  }

  eliminarDirector(id:number){
    this.directorServicio.eliminarDirector(id).subscribe(dato => {
      console.log(dato);
      this.obtenerEmpleados();
    })
  }

  private obtenerEmpleados(){
    this.directorServicio.obtenerListaDeDirectores().subscribe(dato =>{
      this.directores = dato;
    })
  }

  
}
