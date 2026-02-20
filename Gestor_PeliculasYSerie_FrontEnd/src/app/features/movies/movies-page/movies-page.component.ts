import { Component, HostListener } from '@angular/core';
import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './movies-page.component.html',
  styleUrl: './movies-page.component.css'
})
export class MoviesPageComponent {
  movies: Movies[] = [];
  loading = false;

  page = 0;                 // 0-based
  size = 24;                // 28 en 2K, 25 en 1080p (se ajusta dinámicamente)
  lastPageKnown: number | null = null;

  private cache = new Map<number, Movies[]>();
  private sizeBucket = '';
  currentQuery = '';
  currentGenre = '';

  constructor(
    private movieSvc: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Tamaño por viewport
    this.applyPageSizeFromViewport(true);

    // 2) Reaccionar a cambios de query params (?page, ?size, ?q, ?genre)
    this.route.queryParamMap.subscribe(q => {
      const qpPage = Number(q.get('page'));
      const qpSize = Number(q.get('size'));
      const qpQuery = (q.get('q') || '').trim();
      const qpGenre = (q.get('genre') || '').trim();

      if (qpGenre !== this.currentGenre) {
        this.currentGenre = qpGenre;
        this.cache.clear();
        this.lastPageKnown = null;
        this.page = 0;
      }
      if (qpQuery !== this.currentQuery) {
        this.currentQuery = qpQuery;
        this.cache.clear();
        this.lastPageKnown = null;
        this.page = 0;
      }

      // Si viene size en la URL, respétalo
      if (!Number.isNaN(qpSize) && qpSize > 0) {
        if (qpSize !== this.size) {
          this.size = qpSize;
          this.cache.clear();
          this.lastPageKnown = null;
        }
      } else {
        // Si no viene size, ajústalo por bucket actual
        this.applyPageSizeFromViewport(false);
      }

      const targetPage = !Number.isNaN(qpPage) && qpPage >= 0 ? qpPage : 0;
      this.goTo(targetPage, /*skipUrlUpdate*/ true);
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
    } else if (w >= 1920) { // 1080p típico
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
      this.size = newSize;
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

    // Si hay caché para esta página con este filtro, úsala
    const cacheKey = this.cacheKey(p, this.currentQuery, this.currentGenre, this.size);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.movies = cached;
      this.page = p;
      if (!skipUrlUpdate) this.updateUrl();
      return;
    }

    this.loading = true;
    this.movieSvc.getPeliculasBrowser(p, this.size, this.currentQuery, this.currentGenre || undefined).subscribe({
      next: (rows: Movies[]) => {
        this.movies = rows;
        this.cache.set(cacheKey, rows);
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        size: this.size,
        q: this.currentQuery || null,
        genre: this.currentGenre || null,
      },
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

  private cacheKey(p: number, q: string, genre: string, size: number): number {
    let h = 17;
    h = (h * 31 + p) | 0;
    h = (h * 31 + size) | 0;
    for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) | 0;
    for (let i = 0; i < genre.length; i++) h = (h * 31 + genre.charCodeAt(i)) | 0;
    return h;
  }

  /** Título de la sección: "Películas" o "Películas — Acción" cuando hay filtro por género */
  get pageTitle(): string {
    if (!this.currentGenre) return 'Películas';
    const name = this.currentGenre.charAt(0).toUpperCase() + this.currentGenre.slice(1).toLowerCase();
    return `Películas — ${name}`;
  }
}
