import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Movies } from '../movies/movies';
import { MovieService } from '../movies/service/movie.service';

type CarouselItem = {
  img: string;
  title: string;
  rating: string | number;
  description: string;
 
};

type CarouselData = {
  title: string;
  items: CarouselItem[];
};

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  // GRID “Mis favoritos”
  homeMovies: Movies[] = [];

  // Carousels (ej: [Mejor valoradas, Selecciones populares])
  carousels: CarouselData[] = [];

  // Estado por carrusel (por índice)
  currentIndex: number[] = [];
  maxIndex: number[] = [];
  showPrev: boolean[] = [];
  showNext: boolean[] = [];

  // Ajustes de layout/animación
  itemsToMove = 5;
  readonly itemWidth = 290;                 // ancho lógico por item (pares con CSS)
  readonly partialVisibleWidth = 165;       // cuánto “asoma” el primer item
  readonly partialVisibleWidthHighRes = 520;
  readonly initialMarginLeft = 175;         // padding inicial a la izquierda
  readonly initialMarginLeftHighRes = 230;

  // Usado por el template: [style.margin-left.px]="currentIndex[i] === 0 ? leftPaddingPx : 0"
  leftPaddingPx = 175;

  loading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private moviesSvc: MovieService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateItemsToMove();
      this.computeLeftPadding();
    }

    // Carga de datos
    this.cargarTopRatedParaCarrusel(); // “Mejor valoradas”
    this.cargarPopularesParaCarrusel(); // “Selecciones populares” (o cualquier lista que quieras)
    this.cargarPeliculasGrid(); // Grid “Mis favoritos”
  }

  /** --------- Carga de datos ---------- */

  private cargarTopRatedParaCarrusel(): void {
    this.loading = true;
    this.moviesSvc.getTopRated(19).subscribe({
      next: (movies) => {
        const items = movies.slice(0, 19).map(m => ({
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: (typeof m.averageRating === 'number') ? (m.averageRating.toFixed(1) + '/10') : '—',
          description: m.description ?? ''
        }));
        // Añadimos 1 vacío para tu truco de layout del carrusel
        items.push({ img: '', title: '', rating: '', description: ''});

        this.upsertCarousel(0,'Mejor valoradas', items); // carrusel 0
      },
      error: () => {},
      complete: () => (this.loading = false)
    });
  }

  private cargarPopularesParaCarrusel(): void {
    // De ejemplo: usa getAll(0, 19). Cambia por tu endpoint de “populares” si lo tienes.
    this.moviesSvc.getAll(0, 19).subscribe({
      next: (movies) => {
        const items = movies.slice(0, 19).map(m => ({
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: (typeof m.averageRating === 'number') ? (m.averageRating.toFixed(1) + '/10') : '—',
          description: m.description ?? ''
        }));
        items.push({ img: '', title: '', rating: '', description: ''});

        this.upsertCarousel(1,'Selecciones populares', items); // carrusel 1
      }
    });
  }

  private cargarPeliculasGrid(): void {
    this.moviesSvc.getAll(0, 20).subscribe({
      next: movies => this.homeMovies = movies.slice(0, 14)
    });
  }

  /** Inserta/actualiza el carrusel i y asegura que el estado existe */
  private upsertCarousel(i: number,title: string, items: CarouselItem[]): void {
    // Asegura índice
    while (this.carousels.length <= i) {
      this.carousels.push({ title,items: [] });
    }
    this.carousels[i].items = items;

    // Inicializa estado si no existe
    while (this.currentIndex.length <= i) this.currentIndex.push(0);
    while (this.maxIndex.length <= i) this.maxIndex.push(0);
    while (this.showPrev.length <= i) this.showPrev.push(false);
    while (this.showNext.length <= i) this.showNext.push(true);

    // Recalcula límites y aplica transform
    setTimeout(() => {
      this.recomputeMaxIndex(i);
      this.updateNav(i);
      this.applyTransform(i);
    });
  }

  /** --------- Navegación/transform --------- */

  moveCarouselFor(i: number, dir: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let next = this.currentIndex[i] + dir * this.itemsToMove;
    if (next < 0) next = 0;
    if (next > this.maxIndex[i]) next = this.maxIndex[i];

    this.currentIndex[i] = next;
    this.applyTransform(i);
    this.updateNav(i);
  }

  private recomputeMaxIndex(i: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const wrappers = Array.from(document.querySelectorAll('.carousel-wrapper2')) as HTMLElement[];
    const wrapper = wrappers[i];
    if (!wrapper) return;

    const itemsCount = this.carousels[i]?.items?.length ?? 0;
    const visible = Math.max(1, Math.floor(wrapper.offsetWidth / this.itemWidth));
    this.maxIndex[i] = Math.max(0, itemsCount - visible);

    if (this.currentIndex[i] > this.maxIndex[i]) {
      this.currentIndex[i] = this.maxIndex[i];
    }
  }

  private applyTransform(i: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tracks = Array.from(document.querySelectorAll('.carousel2')) as HTMLElement[];
    const track = tracks[i];
    if (!track) return;

    const screenWidth = window.innerWidth;
    const partialWidth = screenWidth >= 2000 ? this.partialVisibleWidthHighRes : this.partialVisibleWidth;

    let offset = this.currentIndex[i] * this.itemWidth - partialWidth;
    if (this.currentIndex[i] === 0) offset = 0;

    track.style.transform = `translateX(-${offset}px)`;
    // OJO: el margen izquierdo del wrapper lo maneja el template con [style.margin-left.px]
    // usando leftPaddingPx. Así evitamos pisarnos con el binding.
  }

  private updateNav(i: number): void {
    this.showPrev[i] = this.currentIndex[i] > 0;
    this.showNext[i] = this.currentIndex[i] < this.maxIndex[i];
  }

  /** --------- Responsivo --------- */

  private updateItemsToMove(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) {
      this.itemsToMove = 2;
    } else if (screenWidth <= 768) {
      this.itemsToMove = 3;
    } else if (screenWidth <= 1900) {
      this.itemsToMove = 5;
    } else {
      this.itemsToMove = 7;
    }
  }

  private computeLeftPadding(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const screenWidth = window.innerWidth;
    this.leftPaddingPx = (screenWidth >= 2000)
      ? this.initialMarginLeftHighRes
      : (screenWidth >= 768 ? this.initialMarginLeft : 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.updateItemsToMove();
    this.computeLeftPadding();

    // Recalcular cada carrusel
    for (let i = 0; i < this.carousels.length; i++) {
      this.recomputeMaxIndex(i);
      this.applyTransform(i);
      this.updateNav(i);
    }
  }
}
