import { Component } from '@angular/core';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { GeneroService, GenreCard } from '../../generos/service/genero.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-movies',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-movies.component.html',
  styleUrl: './lista-movies.component.css'
})
export class ListaMoviesComponent {

  movies: Movies[] = [];
  page = 0;
  size = 50;
  loading = false;
  noMore = false;

  /** Búsqueda por título */
  searchInput = '';
  /** Slug del género seleccionado (vacío = todos) */
  currentGenre = '';
  genreCards: GenreCard[] = [];
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;
  private readonly debounceMs = 350;

  constructor(
    private movieServicio: MovieService,
    private generoSvc: GeneroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generoSvc.getGenreCards().subscribe(cards => (this.genreCards = cards));
    this.loadFirstPage();
  }

  agregarPelicula(): void {
    this.router.navigate(['registrar-pelicula']);
  }

  actualizarPelicula(id: number): void {
    this.router.navigate(['actualizar-pelicula', id]);
  }

  eliminarPelicula(id: number): void {
    this.movieServicio.eliminarPelicula(id).subscribe(() => {
      this.resetAndReload();
    });
  }

  /** Se llama al escribir en el input; recarga con debounce para búsqueda en tiempo real */
  onSearchInputChange(): void {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => this.resetAndReload(), this.debounceMs);
  }

  /** Cambia filtro por género y recarga desde la primera página */
  onGenreChange(_slug: string): void {
    this.resetAndReload();
  }

  private resetAndReload(): void {
    this.page = 0;
    this.movies = [];
    this.noMore = false;
    this.loadFirstPage();
  }

  private loadFirstPage(): void {
    if (this.loading) return;
    this.loading = true;
    const q = this.searchInput.trim() || undefined;
    const genre = this.currentGenre.trim() || undefined;
    this.movieServicio.getPeliculasBrowser(0, this.size, q, genre).subscribe({
      next: (rows) => {
        this.movies = rows;
        this.noMore = rows.length < this.size;
        this.page = 1;
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }

  loadMore(): void {
    if (this.loading || this.noMore) return;
    this.loading = true;
    const q = this.searchInput.trim() || undefined;
    const genre = this.currentGenre.trim() || undefined;
    this.movieServicio.getPeliculasBrowser(this.page, this.size, q, genre).subscribe({
      next: (rows) => {
        this.movies = [...this.movies, ...rows];
        this.noMore = rows.length < this.size;
        this.page++;
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }
}
