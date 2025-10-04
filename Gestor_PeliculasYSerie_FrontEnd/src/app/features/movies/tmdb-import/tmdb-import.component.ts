import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { TmdbService, ImportSummary } from '../service/tmdb.service';

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
  summary?: ImportSummary;
  oneImportMsg = '';
  error = '';

  constructor(private tmdb: TmdbService) {}

  doImportPopular() {
  this.resetMessages();
  this.loading = true;
  this.tmdb.importPopularSummary(this.pages)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (s) => this.summary = s,
      error: (err) => this.error = this.readErr(err)
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
    this.oneImportMsg = '';
    this.error = '';
  }

  private readErr(err: any): string {
    return err?.error?.message || 'Error inesperado al importar.';
  }
}
