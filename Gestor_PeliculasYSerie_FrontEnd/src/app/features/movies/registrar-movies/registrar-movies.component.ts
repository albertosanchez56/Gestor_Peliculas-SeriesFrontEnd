import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { Router } from '@angular/router';
import { Director } from '../../directores/director';
import { DirectorService } from '../../directores/service/director.service';
import { CommonModule } from '@angular/common';
import { Generos } from '../../generos/generos';
import { GeneroService } from '../../generos/service/genero.service';
import { MovieRequest } from '../MovieRequest';

@Component({
  selector: 'app-registrar-movies',
  imports: [CommonModule,FormsModule],
  templateUrl: './registrar-movies.component.html',
  styleUrl: './registrar-movies.component.css'
})
export class RegistrarMoviesComponent {
      
  movie : Movies = new Movies();
  directores:Director[];
  generos:Generos[];
  
    constructor(private movieServicio:MovieService,private directorServicio:DirectorService,private generosServicio:GeneroService, private router: Router) { }
  
    

    ngOnInit() : void {
      this.obtenerDirectores();
      this.obtenerGeneros();
    }
  
    guardarPelicula() {
      const movieData: MovieRequest = {
        title: this.movie.title,
        description: this.movie.description,
        releaseDate: this.movie.releaseDate,
        director: this.movie.director ? { id: this.movie.director.id } : null, // Solo enviamos el ID
        genres: this.movie.genres.map(g => ({ id: g.id })) // Transformamos géneros a solo IDs
      };
    
      console.log("Datos que se enviarán al backend:", JSON.stringify(movieData)); // Para depuración
    
      this.movieServicio.registrarPelicula(movieData).subscribe(
        (dato) => {
          console.log("Película guardada correctamente:", dato);
          this.irALaListaDePeliculas();
        },
        (error) => {
          console.error("Error al guardar la película:", error);
        }
      );
    }
  
    irALaListaDePeliculas(){
      this.router.navigate(['/peliculas']);
    }
  
    onSubmit(){
      console.log("Director seleccionado:", this.movie.director);
      if (!this.movie.director || !this.movie.director.id) {
      console.error("Error: No se ha seleccionado un director.");
      return;
  }
      console.log(this.movie);
      console.log("Datos que se enviarán al backend:", JSON.stringify(this.movie));
      this.guardarPelicula();
    }

    private obtenerDirectores(){
      this.directorServicio.obtenerListaDeDirectores().subscribe(dato =>{
        this.directores = dato;
      })
    }

    private obtenerGeneros(){
      this.generosServicio.obtenerListaDeGeneros().subscribe(dato =>{
        this.generos = dato;
      })
    }
}
