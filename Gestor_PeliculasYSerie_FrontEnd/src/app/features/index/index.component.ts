import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Movies } from '../movies/movies';
import { MovieService, PopularActor } from '../movies/service/movie.service';
import { GeneroService, GenreCard } from '../generos/service/genero.service';
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

  // Carruseles
  topRatedItems: CarouselItem[] = [];
  popularItems:  CarouselItem[] = [];
  popularActorsItems: CarouselItem[] = [];
  upcomingItems: CarouselItem[] = [];

  // Géneros para mini-sección de tarjetas
  genreCards: GenreCard[] = [];
  /** Si es false, solo se muestran 2 filas y el botón "Ver más" en la última celda */
  genresExpanded = false;
  /** Número de celdas en 2 filas (ej. 5 cols × 2 = 10). La última se usa para el botón "Ver más". */
  private readonly initialGenreSlots = 10;

  // Ajustes
  steps = 5;
  leftPaddingPx = 175;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private moviesSvc: MovieService,
    private generoSvc: GeneroService,
    private router: Router
  ) {
    // padding inicial según ancho
    this.computeLeftPadding();

    // cargar datos
    this.cargarTopRatedParaCarrusel();
    this.cargarPopularesParaCarrusel();
    this.cargarActionGrid();
    this.cargarGenreCards();
    this.cargarPopularActors();
    this.cargarUpcomingParaCarrusel();
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

  private cargarUpcomingParaCarrusel(): void {
    this.moviesSvc.getUpcoming(19).subscribe({
      next: movies => {
        this.upcomingItems = movies.slice(0, 19).map(m => ({
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: '', // Próximos estrenos: no se muestra puntuación
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

  private cargarGenreCards(): void {
    this.generoSvc.getGenreCards().subscribe({
      next: cards => this.genreCards = cards
    });
  }

  private cargarPopularActors(): void {
    this.moviesSvc.getPopularActors(19).subscribe({
      next: actors => {
        const list = Array.isArray(actors) ? actors : [];
        this.popularActorsItems = list.map((a: PopularActor) => {
          const movieLine = (a.mostPopularMovieTitle && a.mostPopularCharacterName)
            ? a.mostPopularMovieTitle + ' (' + a.mostPopularCharacterName + ')'
            : (a.mostPopularMovieTitle || '');
          const desc = movieLine
            ? 'En ' + Number(a.movieCount ?? 0) + ' películas\n' + movieLine
            : 'En ' + Number(a.movieCount ?? 0) + ' películas';
          return {
            img: (a.profileUrl != null && a.profileUrl !== '') ? a.profileUrl : 'assets/imagenes/placeholder-poster.png',
            title: a.personName ?? 'Sin nombre',
            rating: '',
            description: desc,
            movieId: undefined
          };
        });
      },
      error: err => {
        console.error('Error cargando actores populares:', err);
      }
    });
  }

  /** Géneros a mostrar: todos si está expandido, si no solo los de las 2 primeras filas (última celda = botón). */
  get visibleGenreCards(): GenreCard[] {
    if (this.genresExpanded) return this.genreCards;
    return this.genreCards.slice(0, Math.max(0, this.initialGenreSlots - 1));
  }

  /** Mostrar botón "Ver más" cuando hay más géneros que los visibles en 2 filas. */
  get showMoreGenresButton(): boolean {
    return !this.genresExpanded && this.genreCards.length > this.initialGenreSlots - 1;
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
