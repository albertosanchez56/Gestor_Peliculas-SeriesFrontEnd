import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { Movies } from '../movies';
import { MovieService } from '../service/movie.service';
import { Director } from '../../directores/director';
import { DirectorService } from '../../directores/service/director.service';
import { Generos } from '../../generos/generos';
import { GeneroService } from '../../generos/service/genero.service';
import { MovieRequest } from '../MovieRequest';
import { finalize } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

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
  selector: 'app-registrar-movies',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-movies.component.html',
  styleUrl: './registrar-movies.component.css'
})
export class RegistrarMoviesComponent {
  
  @ViewChild('f') form!: NgForm;

  movie: Movies = new Movies();
  directores: Director[] = [];
  generos: Generos[] = [];
  apiErrors: MovieApiErrors | undefined;
  submitting = false;

  today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' para [max] del date


  constructor(
    private movieServicio: MovieService,
    private directorServicio: DirectorService,
    private generosServicio: GeneroService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // MUY IMPORTANTE para el <select multiple> 
    if (!this.movie.genres) this.movie.genres = [];

    this.obtenerDirectores();
    this.obtenerGeneros();
  }

  private fechaISO(d: any): string {
    // Acepta string 'yyyy-MM-dd' o Date y lo normaliza
    try {
      // Si ya es 'yyyy-MM-dd', devuélvelo
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      return formatDate(d, 'yyyy-MM-dd', 'en-CA');
    } catch {
      return '';
    }
  }

  
  

private nullIfEmpty(v?: string | null): string | null {
  return v && v.trim() !== '' ? v.trim() : null;
}

guardarPelicula() {
  this.apiErrors = {};
  const errors: Record<string, string> = {};

  // Valida todo SIN return
  
  if (!this.movie.description?.trim()) {
    errors['description'] = 'La descripción es obligatoria';
  }

  if (!this.movie.releaseDate) {
    errors['releaseDate'] = 'La fecha es obligatoria';
  } else if (new Date(this.movie.releaseDate) > new Date()) {
    errors['releaseDate'] = 'La fecha no puede ser futura';
  }


  // Opcionales con reglas
  if (this.movie.durationMinutes != null) {
    const dm = this.movie.durationMinutes;
    if (dm < 1 || dm > 600) {
      errors['durationMinutes'] = 'Duración entre 1 y 600 minutos';
    }
  }
  if (this.movie.originalLanguage && !/^[a-zA-Z]{2}$/.test(this.movie.originalLanguage)) {
    errors['originalLanguage'] = 'Usa 2 letras (ISO-639-1), p.ej. "es"';
  }

  // Si hay errores, muéstralos y no llames al backend
  if (Object.keys(errors).length > 0) {
    this.apiErrors = errors;
    // opcional: marca todo como tocado para que salgan hints del template
    this.form?.form.markAllAsTouched?.();
    return;
  }

  // Si todo OK, construye el payload y llama al backend
  const payload: MovieRequest = {
    title: this.movie.title!.trim(),
    description: this.movie.description?.trim() || '',
    releaseDate: this.fechaISO(this.movie.releaseDate),
    directorId: Number(this.movie.director!.id),
    genreIds: (this.movie.genres ?? []).map(g => Number(g.id)),
    durationMinutes: this.movie.durationMinutes ?? undefined,
    originalLanguage: this.movie.originalLanguage?.trim() || undefined,
    posterUrl: this.movie.posterUrl?.trim() || undefined,
    backdropUrl: this.movie.backdropUrl?.trim() || undefined,
    trailerUrl: this.movie.trailerUrl?.trim() || undefined,
    ageRating: this.movie.ageRating || undefined
  };

  this.submitting = true;
  this.movieServicio.registrarPelicula(payload)
    .pipe(finalize(() => (this.submitting = false)))
    .subscribe({
      next: () => this.irALaListaDePeliculas(),
      error: (err) => {
        if (err?.status === 400 && err?.error?.errors) {
          this.apiErrors = err.error.errors;
        } else if (err?.error?.message) {
          this.apiErrors = { _global: err.error.message };
        } else {
          this.apiErrors = { _global: 'Error inesperado. Inténtalo de nuevo.' };
        }
      }
    });
}


  irALaListaDePeliculas() {
    this.router.navigate(['/peliculas']);
  }

  onSubmit() {
    this.guardarPelicula();
  }

  private obtenerDirectores() {
    this.directorServicio.obtenerListaDeDirectores().subscribe(d => this.directores = d);
  }

  private obtenerGeneros() {
    this.generosServicio.obtenerListaDeGeneros().subscribe(g => this.generos = g);
  }
}