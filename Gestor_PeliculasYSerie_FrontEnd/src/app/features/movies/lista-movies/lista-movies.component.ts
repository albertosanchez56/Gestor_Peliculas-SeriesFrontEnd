import { Component } from '@angular/core';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Director } from '../../directores/director';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-lista-movies',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './lista-movies.component.html',
  styleUrl: './lista-movies.component.css'
})
export class ListaMoviesComponent {


  movies: Movies[] = [];
  page = 0;
  size = 50;
  loading = false;
  noMore = false;



  constructor(private movieServicio: MovieService, private router: Router) { }



  ngOnInit(): void {
    console.log('ListaPeliculasComponent cargado');
    this.obtenerPeliculas();
    this.loadMore();
  }

  agregarPelicula() {
    this.router.navigate(['registrar-pelicula']);
  }

  actualizarPelicula(id: number) {
    this.router.navigate(['actualizar-pelicula', id]);
  }

  eliminarPelicula(id: number) {
    this.movieServicio.eliminarPelicula(id).subscribe(dato => {
      console.log(dato);
      this.obtenerPeliculas();
    })
  }

  private obtenerPeliculas() {
    this.movieServicio.obtenerListaDePeliculas().subscribe(dato => {
      this.movies = dato;
    })
  }

  loadMore() {
  if (this.loading || this.noMore) return;
  this.loading = true;
  this.movieServicio.getPeliculas(this.page, this.size).subscribe({
    next: (rows) => {
      this.movies = [...this.movies, ...rows];
      this.noMore = rows.length < this.size; // si vino menos, no hay más
      this.page++;
    },
    error: () => {},
    complete: () => this.loading = false
  });
}

}
