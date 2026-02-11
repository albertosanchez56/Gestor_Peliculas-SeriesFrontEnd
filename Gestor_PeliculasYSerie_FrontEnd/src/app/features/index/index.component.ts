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

  // GRID “Género Acción” (mejor valoradas de ese género)
  actionMovies: Movies[] = [];

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
    this.cargarActionGrid();
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

  /** Películas de Acción (mejor valoradas). 14 en 2K, 10 en 1080. */
  private cargarActionGrid(): void {
    const limit = this.getActionGridLimit();
    this.moviesSvc.getTopRatedByGenre('accion', limit).subscribe({
      next: movies => this.actionMovies = movies
    });
  }

  /** 14 si resolución 2K (>= 2048px), 10 si 1080. */
  private getActionGridLimit(): number {
    if (!isPlatformBrowser(this.platformId)) return 10;
    return window.innerWidth >= 2048 ? 14 : 10;
  }

  private computeLeftPadding(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const w = window.innerWidth;
    this.leftPaddingPx = (w >= 2048) ? 230      // ~2K o más
                    : (w >= 1500) ? 175     // 1080p
                    : 0;                    // <1080 → sin espacio
  }

  @HostListener('window:resize')
  onResize(): void {
    this.computeLeftPadding();
    this.cargarActionGrid();
  }
}
