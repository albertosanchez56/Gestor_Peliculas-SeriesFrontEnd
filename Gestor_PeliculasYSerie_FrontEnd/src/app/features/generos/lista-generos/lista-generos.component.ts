import { Component } from '@angular/core';
import { GeneroService } from '../service/genero.service';
import { Router } from '@angular/router';
import { Generos } from '../generos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-generos',
  imports: [CommonModule],
  templateUrl: './lista-generos.component.html',
  styleUrl: './lista-generos.component.css'
})
export class ListaGenerosComponent {

  generos:Generos[];
  
    constructor(private generoServicio: GeneroService, private router:Router){}
  
    ngOnInit(): void{
      console.log('ListaGenerosComponent cargado');
      this.obtenerGeneros();
    }
  
    agregarGenero(){
      this.router.navigate(['registrar-genero']);
    }
  
    actualizarGenero(id:number){
      this.router.navigate(['actualizar-genero',id]);
    }
  
    eliminarGenero(id:number){
      this.generoServicio.eliminarGenero(id).subscribe(dato => {
        console.log(dato);
        this.obtenerGeneros();
      })
    }
  
    private obtenerGeneros(){
      this.generoServicio.obtenerListaDeGeneros().subscribe(dato =>{
        this.generos = dato;
      })
    }
}
