import { Component, HostListener } from '@angular/core';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-page',
  imports: [RouterLink,CommonModule],
  templateUrl: './movies-page.component.html',
  styleUrl: './movies-page.component.css'
})
export class MoviesPageComponent {
 movies: Movies[] = [];
  loading = false;

  page = 0;                 // 0-based
  size = 24;                // se ajusta dinámicamente (28 en 2K, 25 en 1080p)
  lastPageKnown: number | null = null;

  private cache = new Map<number, Movies[]>();
  private sizeBucket = '';  // '2k' | '1080' | 'default'

  constructor(
    private movieSvc: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Determinar bucket inicial por viewport
    this.applyPageSizeFromViewport(true);

    // 2) Escuchar query params (?page, ?size) y cargar la página correspondiente
    this.route.queryParamMap.subscribe(q => {
      const qpPage = Number(q.get('page'));
      const qpSize = Number(q.get('size'));

      // Si viene size en la URL y es válido, úsalo (tiene prioridad sobre bucket)
      if (!Number.isNaN(qpSize) && qpSize > 0) {
        if (qpSize !== this.size) {
          this.size = qpSize;
          this.cache.clear();
          this.lastPageKnown = null;
        }
      } else {
        // Si no viene size en la URL, ajusta por bucket actual
        this.applyPageSizeFromViewport(false);
      }

      const targetPage = !Number.isNaN(qpPage) && qpPage >= 0 ? qpPage : 0;
      this.goTo(targetPage, /*skipUrlUpdate*/ true); // no escribas de nuevo la URL aquí
    });
  }

  /** Decide size según ancho del viewport y, si cambia de bucket, resetea paginación/caché */
  private applyPageSizeFromViewport(resetIfChanged = false): void {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;

    let newBucket: string;
    let newSize: number;

    if (w >= 2048) {      // “2K” aprox y superiores
      newBucket = '2k';
      newSize = 28;
    } else if (w >= 1920) { // 1080p típico (ancho >= 1920)
      newBucket = '1080';
      newSize = 25;
    } else {
      newBucket = 'default';
      newSize = 24;
    }

    if (this.sizeBucket !== newBucket) {
      this.sizeBucket = newBucket;
      if (this.size !== newSize) {
        this.size = newSize;
        if (resetIfChanged) {
          this.cache.clear();
          this.lastPageKnown = null;
          this.page = 0;
        }
      }
    } else {
      this.size = newSize; // asegúralo por si acaso
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const prevBucket = this.sizeBucket;
    this.applyPageSizeFromViewport(true);
    if (this.sizeBucket !== prevBucket) {
      // Cambió el bucket -> recarga desde página 0 y actualiza URL
      this.goTo(0);
    }
  }

  goTo(p: number, skipUrlUpdate = false): void {
    if (p < 0) return;
    if (this.lastPageKnown !== null && p > this.lastPageKnown) return;

    const cached = this.cache.get(p);
    if (cached) {
      this.movies = cached;
      this.page = p;
      if (!skipUrlUpdate) this.updateUrl();
      return;
    }

    this.loading = true;
    this.movieSvc.getPeliculas(p, this.size).subscribe({
      next: (rows: Movies[]) => {
        this.movies = rows;
        this.cache.set(p, rows);
        this.page = p;

        if (rows.length < this.size) {
          this.lastPageKnown = p;
        }

        if (!skipUrlUpdate) this.updateUrl();
      },
      error: () => {},
      complete: () => (this.loading = false),
    });
  }

  private updateUrl(): void {
    // Escribe ?page y ?size en la URL (sin recargar)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page, size: this.size },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  prev(): void { this.goTo(this.page - 1); }
  next(): void { this.goTo(this.page + 1); }

  get canPrev(): boolean {
    return this.page > 0 && !this.loading;
  }
  get canNext(): boolean {
    if (this.lastPageKnown !== null) return this.page < this.lastPageKnown && !this.loading;
    return !this.loading;
  }

  get pageLabel(): string {
    const current = this.page + 1;
    if (this.lastPageKnown !== null) {
      const total = this.lastPageKnown + 1;
      return `${current} / ${total}`;
    }
    return `Página ${current}`;
  }
}