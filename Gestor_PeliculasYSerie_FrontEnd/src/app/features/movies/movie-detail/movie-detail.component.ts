import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { Movies } from '../movies';
import { CastCredit, MovieService } from '../service/movie.service';

// Ajusta estos imports a tu estructura real
import { AuthService } from '../../../core/auth.service';
import { ReviewService } from '../../review/review.service';

// ✅ Modelos recomendados (si no los tienes, crea interfaces iguales)
export interface MovieStatsDTO {
  averageUserRating: number | null;
  voteCount: number; // o number | null si quieres
}


// ✅ esto debería coincidir con lo que devuelve el back (ReviewViewDTO)
export interface ReviewViewDTO {
  id: number;
  movieId: number;
  userId: number;
  displayName: string;

  rating: number;
  comment?: string | null;
  containsSpoilers: boolean;
  edited: boolean;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie?: Movies;
  cast: CastCredit[] = [];
  loading = true;

  // UI
  showAllCast = false;

  // Reviews
  reviews: ReviewViewDTO[] = [];
  statsData: MovieStatsDTO | null = null;
  loadingReviews = false;
  sendingReview = false;

  // Mi review (para ocultar el formulario si ya existe)
  myReview: ReviewViewDTO | null = null;
  loadingMyReview = false;

  // Form crear/editar review
  myRating = 8;
  myComment = '';
  mySpoilers = false;
  isEditingMyReview = false;
  deletingReviewId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private reviewSvc: ReviewService,
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private viewport: ViewportScroller,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const id = Number(pm.get('id'));
      if (!id) {
        this.loading = false;
        return;
      }

      this.loading = true;

      this.movieSvc.getById(id).subscribe({
        next: (m) => {
          this.movie = m;

          // Cast
          this.movieSvc.getCast(m.id).subscribe({
            next: (c) => (this.cast = c ?? []),
            error: () => (this.cast = []),
            complete: () => (this.loading = false)
          });

          // Reviews + stats + mi review
          this.loadReviews(m.id);
          this.loadMyReview(m.id);

          // Scroll top
          if (this.isBrowser) {
            this.viewport.scrollToPosition([0, 0]);
          }
        },
        error: () => (this.loading = false)
      });
    });
  }

  /* =========================
     Reviews
     ========================= */

  loadReviews(movieId: number): void {
    this.loadingReviews = true;

    // stats
    this.reviewSvc.stats(movieId).subscribe({
      next: (s: MovieStatsDTO) => (this.statsData = s),
      error: () => (this.statsData = null)
    });

    // listado
    this.reviewSvc.listByMovie(movieId).subscribe({
      next: (rows: ReviewViewDTO[]) => (this.reviews = rows ?? []),
      error: () => (this.reviews = []),
      complete: () => (this.loadingReviews = false)
    });
  }

  loadMyReview(movieId: number): void {
    this.myReview = null;

    if (!this.auth.isLoggedIn()) return;

    this.loadingMyReview = true;

    // ✅ endpoint recomendado: GET /reviews/me/movie/{movieId}
    this.reviewSvc.myReviewForMovie(movieId).pipe(
      catchError(() => of(null))
    ).subscribe({
      next: (r: any) => {
        this.myReview = r;
        this.loadingMyReview = false;
      },
      error: () => {
        this.myReview = null;
        this.loadingMyReview = false;
      }
    });
  }

  submitReview(): void {
    const mv = this.movie;
    if (!mv) return;
    if (!this.auth.isLoggedIn()) return;
    if (this.myReview && !this.isEditingMyReview) return;

    const rating = Number(this.myRating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 10) return;

    this.sendingReview = true;

    if (this.isEditingMyReview && this.myReview) {
      this.reviewSvc.update(this.myReview.id, {
        rating,
        comment: this.myComment?.trim() || null,
        containsSpoilers: this.mySpoilers
      }).subscribe({
        next: () => {
          this.isEditingMyReview = false;
          this.loadReviews(mv.id);
          this.loadMyReview(mv.id);
          this.sendingReview = false;
        },
        error: () => { this.sendingReview = false; }
      });
      return;
    }

    this.reviewSvc.create({
      movieId: mv.id,
      rating,
      comment: this.myComment?.trim() || undefined,
      containsSpoilers: this.mySpoilers
    }).subscribe({
      next: () => {
        this.myComment = '';
        this.mySpoilers = false;
        this.loadReviews(mv.id);
        this.loadMyReview(mv.id);
        this.sendingReview = false;
      },
      error: () => { this.sendingReview = false; }
    });
  }

  startEdit(): void {
    if (!this.myReview) return;
    this.myRating = this.myReview.rating;
    this.myComment = this.myReview.comment ?? '';
    this.mySpoilers = this.myReview.containsSpoilers;
    this.isEditingMyReview = true;
  }

  cancelEdit(): void {
    this.isEditingMyReview = false;
  }

  deleteMyReview(): void {
    if (!this.myReview || !this.movie) return;
    if (!confirm('¿Borrar tu reseña? Esta acción no se puede deshacer.')) return;
    this.deletingReviewId = this.myReview.id;
    this.reviewSvc.delete(this.myReview.id).subscribe({
      next: () => {
        this.myReview = null;
        this.isEditingMyReview = false;
        this.loadReviews(this.movie!.id);
        this.deletingReviewId = null;
      },
      error: () => { this.deletingReviewId = null; }
    });
  }

  deleteReview(r: ReviewViewDTO): void {
    if (!this.movie) return;
    const isMine = this.isMyReview(r);
    const msg = isMine
      ? '¿Borrar tu reseña? Esta acción no se puede deshacer.'
      : '¿Borrar esta reseña? (solo administradores). Esta acción no se puede deshacer.';
    if (!confirm(msg)) return;
    this.deletingReviewId = r.id;
    this.reviewSvc.delete(r.id).subscribe({
      next: () => {
        if (isMine) this.myReview = null;
        this.isEditingMyReview = false;
        this.loadReviews(this.movie!.id);
        this.deletingReviewId = null;
      },
      error: () => { this.deletingReviewId = null; }
    });
  }

  canDeleteReview(r: ReviewViewDTO): boolean {
    return this.auth.isLoggedIn() && (this.isMyReview(r) || this.auth.isAdmin());
  }

  /* ---------- UI helpers ---------- */

  backdropSrc(m?: Movies): string {
    const url = m?.backdropUrl || m?.posterUrl || 'assets/imagenes/placeholder-poster.png';
    return this.upscaleTmdb(url, 'w1280');
  }

  backdropSrcset(m?: Movies): string {
    const base = m?.backdropUrl || m?.posterUrl;
    if (!base || !base.includes('image.tmdb.org')) return '';
    const w780 = this.upscaleTmdb(base, 'w780');
    const w1280 = this.upscaleTmdb(base, 'w1280');
    const original = this.upscaleTmdb(base, 'original');
    return `${w780} 780w, ${w1280} 1280w, ${original} 2000w`;
  }

  private upscaleTmdb(url: string, size: 'w780' | 'w1280' | 'original'): string {
    if (!url.includes('image.tmdb.org')) return url;
    return url.replace(/\/(w\d+|original)\//, `/${size}/`);
  }

  get genreList(): string {
    return (this.movie?.genres ?? []).map(g => g.name).join(', ');
  }

  get ratingText(): string {
    const r = this.movie?.averageRating;
    return typeof r === 'number' ? `⭐ ${r.toFixed(1)}/10` : '—';
  }

  get trailerEmbed(): SafeResourceUrl | null {
    const url = this.movie?.trailerUrl;
    if (!url) return null;
    const id = this.extractYoutubeId(url);
    return id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
        )
      : null;
  }

  private extractYoutubeId(url: string): string | null {
    const r1 = /youtu\.be\/([A-Za-z0-9_-]{6,})/i.exec(url);
    if (r1?.[1]) return r1[1];
    const r2 = /[?&]v=([A-Za-z0-9_-]{6,})/i.exec(url);
    if (r2?.[1]) return r2[1];
    return null;
  }

  get visibleCast(): CastCredit[] {
    return this.showAllCast ? this.cast : this.cast.slice(0, 10);
  }

  /** Reseñas de otros usuarios (la del usuario actual se muestra solo en el bloque "Tu reseña"). */
  get otherReviews(): ReviewViewDTO[] {
    if (!this.myReview) return this.reviews;
    return this.reviews.filter(r => r.id !== this.myReview!.id);
  }

  isMyReview(r: ReviewViewDTO): boolean {
    return !!this.myReview && r.id === this.myReview.id;
  }

  toggleCast(): void {
    this.showAllCast = !this.showAllCast;
  }

  onToggleFavorite(): void {
    console.log('Fav clicked');
  }
}
