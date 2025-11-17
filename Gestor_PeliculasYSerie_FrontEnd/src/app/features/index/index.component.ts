import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Movies } from '../movies/movies';
import { MovieService } from '../movies/service/movie.service';
import { CarouselItem, CarouselComponent } from '../../shared/carousel/carousel.component';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CarouselComponent,RouterModule],
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
    private moviesSvc: MovieService,private router: Router
  ) {
    // padding inicial según ancho
    this.computeLeftPadding();

    // cargar datos
    this.cargarTopRatedParaCarrusel();
    this.cargarPopularesParaCarrusel();
    this.cargarPeliculasGrid();
  }

  onCarouselItem(it: CarouselItem): void {
  if (it.movieId != null) this.router.navigate(['/movies', it.movieId]);
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
          description: m.description ?? '',
          movieId: m.id
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
          description: m.description ?? '',
          movieId: m.id
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
