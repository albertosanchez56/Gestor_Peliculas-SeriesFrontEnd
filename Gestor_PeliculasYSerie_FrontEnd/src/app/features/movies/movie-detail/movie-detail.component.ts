import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Movies } from '../movies';
import { CastCredit, MovieService } from '../service/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie?: Movies;
  cast: CastCredit[] = [];
  loading = true;

  // UI
  showAllCast = false;

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loading = false; return; }

    this.movieSvc.getById(id).subscribe({
      next: (m) => {
        this.movie = m;
        // cargar cast cuando ya tenemos película
        this.movieSvc.getCast(m.id).subscribe({
          next: (c) => this.cast = c ?? [],
          complete: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  /* ---------- UI helpers ---------- */
  backdropSrc(m?: Movies): string {
  const url = m?.backdropUrl || m?.posterUrl || 'assets/imagenes/placeholder-poster.png';
  return this.upscaleTmdb(url, 'w1280'); // usa 'original' si quieres máxima calidad
}

backdropSrcset(m?: Movies): string {
  const base = m?.backdropUrl || m?.posterUrl;
  if (!base || !base.includes('image.tmdb.org')) return '';
  const w780     = this.upscaleTmdb(base, 'w780');
  const w1280    = this.upscaleTmdb(base, 'w1280');
  const original = this.upscaleTmdb(base, 'original');
  return `${w780} 780w, ${w1280} 1280w, ${original} 2000w`;
}

private upscaleTmdb(url: string, size: 'w780'|'w1280'|'original'): string {
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

  // Backdrop como CSS var para el hero
  get backdropStyle(): {[k: string]: string} {
    const url = this.movie?.backdropUrl || 'assets/imagenes/placeholder-backdrop.jpg';
    return { '--backdrop-url': `url('${url}')` };
  }

  // Tráiler embebido (YouTube)
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

  // Soporta youtu.be/ID y youtube.com/watch?v=ID
  private extractYoutubeId(url: string): string | null {
    const r1 = /youtu\.be\/([A-Za-z0-9_-]{6,})/i.exec(url);
    if (r1?.[1]) return r1[1];
    const r2 = /[?&]v=([A-Za-z0-9_-]{6,})/i.exec(url);
    if (r2?.[1]) return r2[1];
    return null;
  }

  // Reparto visible: 10 por defecto; con toggle muestra todos
  get visibleCast(): CastCredit[] {
    return this.showAllCast ? this.cast : this.cast.slice(0, 10);
  }

  toggleCast(): void {
    this.showAllCast = !this.showAllCast;
  }

  // Placeholder de favorito (sin lógica de backend todavía)
  onToggleFavorite(): void {
    console.log('Fav clicked');
  }
}
