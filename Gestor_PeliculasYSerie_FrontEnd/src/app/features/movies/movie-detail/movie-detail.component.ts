import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Movies } from '../movies';
import { CastCredit, MovieService } from '../service/movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  movie?: Movies;
  cast: CastCredit[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

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

  get genreList(): string {
    return (this.movie?.genres ?? []).map(g => g.name).join(', ');
  }

  get ratingText(): string {
    const r = this.movie?.averageRating;
    return typeof r === 'number' ? `⭐${r.toFixed(1)}/10` : '⭐—';
  }

  // Placeholder de favorito (sin lógica de backend todavía)
  onToggleFavorite(): void {
    // implementar cuando tengas micro de usuarios/favoritos
    console.log('Fav clicked');
  }
}
