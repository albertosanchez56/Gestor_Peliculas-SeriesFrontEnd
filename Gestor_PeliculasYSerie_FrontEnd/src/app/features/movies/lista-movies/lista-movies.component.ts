import { Component } from '@angular/core';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Director } from '../../directores/director';

@Component({
  selector: 'app-lista-movies',
  imports: [CommonModule],
  templateUrl: './lista-movies.component.html',
  styleUrl: './lista-movies.component.css'
})
export class ListaMoviesComponent {

  
    movies:Movies[];
    director:Director[];
  
    constructor(private movieServicio: MovieService, private router:Router){}
  
    ngOnInit(): void{
      console.log('ListaPeliculasComponent cargado');
      this.obtenerPeliculas();
    }
  
    agregarPelicula(){
      this.router.navigate(['registrar-pelicula']);
    }
  
    actualizarPelicula(id:number){
      this.router.navigate(['actualizar-pelicula',id]);
    }
  
    eliminarPelicula(id:number){
      this.movieServicio.eliminarPelicula(id).subscribe(dato => {
        console.log(dato);
        this.obtenerPeliculas();
      })
    }
  
    private obtenerPeliculas(){
      this.movieServicio.obtenerListaDePeliculas().subscribe(dato =>{
        this.movies = dato;
      })
    }
  
}
