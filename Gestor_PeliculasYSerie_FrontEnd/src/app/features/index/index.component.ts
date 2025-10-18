import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Movies } from '../movies/movies';
import { MovieService } from '../movies/service/movie.service';
import { CarouselComponent, CarouselItem } from "../../shared/carousel/carousel.component";



@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  // GRID “Mis favoritos”
  homeMovies: Movies[] = [];

  // Carruseles (prepara 2 listas)
  topRatedItems: CarouselItem[] = [];
  popularItems:  CarouselItem[] = [];

  // Ajustes
  steps = 5;
  leftPaddingPx = 175;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private moviesSvc: MovieService
  ) {
    // padding inicial según ancho
    this.computeLeftPadding();

    // cargar datos
    this.cargarTopRatedParaCarrusel();
    this.cargarPopularesParaCarrusel();
    this.cargarPeliculasGrid();
  }

  private cargarTopRatedParaCarrusel(): void {
    this.moviesSvc.getTopRated(19).subscribe({
      next: movies => {
        // exactamente 19 (o menos si no hay) — tú antes metías 1 “vacío”,
        // aquí no hace falta: el componente ya no depende de ese truco
        this.topRatedItems = movies.slice(0, 19).map(m => ({
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: (typeof m.averageRating === 'number') ? (m.averageRating.toFixed(1) + '/10') : '—',
          description: m.description ?? ''
        }));
      }
    });
  }

  private cargarPopularesParaCarrusel(): void {
    this.moviesSvc.getAll(0, 19).subscribe({
      next: movies => {
        this.popularItems = movies.slice(0, 19).map(m => ({
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: (typeof m.averageRating === 'number') ? (m.averageRating.toFixed(1) + '/10') : '—',
          description: m.description ?? ''
        }));
      }
    });
  }

  private cargarPeliculasGrid(): void {
    this.moviesSvc.getAll(0, 20).subscribe({
      next: movies => this.homeMovies = movies.slice(0, 14)
    });
  }

  private computeLeftPadding(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const w = window.innerWidth;
    this.leftPaddingPx = (w >= 2000) ? 230 : (w >= 768 ? 175 : 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.computeLeftPadding();
  }
}