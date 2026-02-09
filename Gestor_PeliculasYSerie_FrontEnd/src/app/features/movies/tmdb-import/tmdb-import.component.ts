import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, concatMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { TmdbService, ImportSummary, ImportPageResponse } from '../service/tmdb.service';

@Component({
  selector: 'app-tmdb-import',
  imports: [CommonModule, FormsModule],
  templateUrl: './tmdb-import.component.html',
  styleUrl: './tmdb-import.component.css'
})
export class TmdbImportComponent {
  pages = 1;
  tmdbId?: number;

  loading = false;
  /** Progreso: página actual (1..totalPages) mientras se importa. */
  currentPage = 0;
  /** Resumen acumulado durante la importación página a página. */
  progressSummary: { created: number; updated: number; skipped: number; errors: string[] } = { created: 0, updated: 0, skipped: 0, errors: [] };
  /** Películas importadas hasta ahora (para ir mostrando la lista). */
  importedMovies: { id: number; title: string; [key: string]: unknown }[] = [];
  summary?: ImportSummary;
  oneImportMsg = '';
  error = '';

  constructor(private tmdb: TmdbService) {}

  doImportPopular() {
    this.resetMessages();
    this.loading = true;
    this.currentPage = 0;
    this.progressSummary = { created: 0, updated: 0, skipped: 0, errors: [] };
    this.importedMovies = [];

    const pageNumbers = Array.from({ length: this.pages }, (_, i) => i + 1);
    from(pageNumbers).pipe(
      concatMap((page) => this.tmdb.importPopularPage(page)),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res: ImportPageResponse) => {
        this.currentPage = res.page;
        this.progressSummary.created += res.created ?? 0;
        this.progressSummary.updated += res.updated ?? 0;
        this.progressSummary.skipped += res.skipped ?? 0;
        if (res.errors?.length) this.progressSummary.errors.push(...res.errors);
        if (res.movies?.length) this.importedMovies.push(...res.movies);
      },
      error: (err) => this.error = this.readErr(err),
      complete: () => {
        this.summary = {
          requested: this.progressSummary.created + this.progressSummary.updated + this.progressSummary.skipped,
          created: this.progressSummary.created,
          updated: this.progressSummary.updated,
          skipped: this.progressSummary.skipped,
          importedIds: this.importedMovies.map(m => m.id),
          errors: this.progressSummary.errors
        };
      }
    });
  }

  doImportById() {
  if (!this.tmdbId) return;
  this.resetMessages();
  this.loading = true;
  this.tmdb.importById(this.tmdbId)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: () => this.oneImportMsg = `Película TMDB ${this.tmdbId} importada/actualizada.`,
      error: (err) => this.error = this.readErr(err)
    });
}


  private resetMessages() {
    this.summary = undefined;
    this.currentPage = 0;
    this.progressSummary = { created: 0, updated: 0, skipped: 0, errors: [] };
    this.importedMovies = [];
    this.oneImportMsg = '';
    this.error = '';
  }

  private readErr(err: any): string {
    const body = err?.error;
    if (body && typeof body === 'object' && body.message) return body.message;
    if (body && typeof body === 'string') return body;
    return err?.message || `Error al importar (${err?.status || '?'}). Revisa la consola.`;
  }
}
