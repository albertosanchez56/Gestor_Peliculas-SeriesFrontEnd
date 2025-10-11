import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movies } from '../movies';
import { Director } from '../../directores/director';
import { Generos } from '../../generos/generos';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../service/movie.service';
import { DirectorService } from '../../directores/service/director.service';
import { GeneroService } from '../../generos/service/genero.service';
import { finalize, forkJoin } from 'rxjs';
import { MovieRequest } from '../MovieRequest';

type MovieApiErrors = Partial<{
  _global: string;
  title: string;
  description: string;
  releaseDate: string;
  directorId: string;
  genreIds: string;
  durationMinutes: string;
  originalLanguage: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  ageRating: string;
}>;

@Component({
  selector: 'app-actualizar-movies',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-movies.component.html',
  styleUrl: './actualizar-movies.component.css'
})
export class ActualizarMoviesComponent {
  movie: Movies = new Movies();
  directores: Director[] = [];
  generos: Generos[] = [];

  apiErrors: MovieApiErrors = {};
  submitting = false;
  loading = true;
  today = formatDate(new Date(), 'yyyy-MM-dd', 'en-CA');

  private id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieSrv: MovieService,
    private directorSrv: DirectorService,
    private generoSrv: GeneroService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

  this.loading = true;
  forkJoin({
    dirs: this.directorSrv.obtenerListaDeDirectores(),
    gens: this.generoSrv.obtenerListaDeGeneros(),
    mov : this.movieSrv.obtenerPeliculaPorId(this.id)
  })
  .pipe(finalize(() => (this.loading = false)))
  .subscribe({
    next: ({ dirs, gens, mov }) => {
      this.directores = dirs ?? [];
      this.generos = gens ?? [];
      this.patchFromServer(mov);

      // 👇 solo añadimos esta línea
      this.syncDirectorRef();
    },
    error: () => this.apiErrors = { _global: 'No se pudo cargar la película.' }
  });
  }

  // Normaliza lo que llega del servidor a tu modelo de formulario
  private patchFromServer(mov: Movies) {
    // Asegura fecha 'yyyy-MM-dd' para el input date
    const dateStr = this.toISODate(mov.releaseDate);

    // Sincroniza director por id (para que el <select> marque el correcto)
    const selectedDirector = mov?.director?.id
      ? this.directores.find(d => d.id === mov.director!.id)
      : undefined;

    // Sincroniza géneros por id (para el <select multiple>)
    const selectedGenres = Array.isArray(mov?.genres)
      ? mov.genres
          .map(g => this.generos.find(gg => gg.id === g.id))
          .filter(Boolean) as Generos[]
      : [];

    this.movie = {
      ...new Movies(),
      ...mov,
      releaseDate: dateStr,
      director: selectedDirector,
      genres: selectedGenres
    } as Movies;
  }

  private toISODate(d: any): string {
    try {
      if (!d) return '';
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      return formatDate(d, 'yyyy-MM-dd', 'en-CA');
    } catch { return ''; }
  }

  private nullIfEmpty(v?: string | null): string | null {
    const s = (v ?? '').trim();
    return s.length ? s : null;
  }

  onSubmit() {
    this.actualizar();
  }

  actualizar() {
  this.apiErrors = {};

  if (!this.movie?.director?.id) {
    this.apiErrors['directorId'] = 'Debes seleccionar un director';
    return;
  }
  if (!this.movie?.genres?.length) {
    this.apiErrors['genreIds'] = 'Selecciona al menos un género';
    return;
  }

  const fechaISO = this.toISODate(this.movie.releaseDate);

  // 👉 Payload en el shape que espera el backend (MovieRequest)
  const payload: any = {
    title: (this.movie.title ?? '').trim(),
    description: (this.movie.description ?? '').trim(),
    releaseDate: fechaISO,                                 // 'yyyy-MM-dd'
    directorId: Number(this.movie.director.id),            // id plano
    genreIds: (this.movie.genres ?? []).map(g => Number(g.id)), // ids planos

    // campos opcionales (si tu MovieRequest los tiene)
    durationMinutes: this.movie.durationMinutes ?? null,
    originalLanguage: (this.movie.originalLanguage ?? '').trim() || null,
    posterUrl: (this.movie.posterUrl ?? '').trim() || null,
    backdropUrl: (this.movie.backdropUrl ?? '').trim() || null,
    trailerUrl: (this.movie.trailerUrl ?? '').trim() || null,
    ageRating: (this.movie.ageRating ?? '').trim() || null
  };

  this.submitting = true;
  // No cambiamos tu servicio; solo el cuerpo que le pasamos
  this.movieSrv.actualizarPelicula(this.id, payload as any)
    .pipe(finalize(() => (this.submitting = false)))
    .subscribe({
      next: () => this.router.navigate(['/peliculas']),
      error: (err) => {
        if (err?.status === 400 && err?.error?.errors) {
          this.apiErrors = err.error.errors;   // { campo: mensaje }
        } else if (err?.error?.message) {
          this.apiErrors = { _global: err.error.message };
        } else {
          this.apiErrors = { _global: 'Error al actualizar la película.' };
        }
      }
    });
}
private syncDirectorRef(): void {
  const currentId = this.movie?.director?.id;
  if (currentId == null) return;

  const match = this.directores.find(d => d.id === currentId);
  if (match) this.movie!.director = match; // misma instancia que vive en el array del select
}

}
