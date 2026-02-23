import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ImportSummary {
  requested: number;
  created: number;
  updated: number;
  skipped: number;
  importedIds: number[];
  errors: string[];
}

/** Respuesta de importar una sola página (para progreso en la UI). */
export interface ImportPageResponse {
  page: number;
  movies: { id: number; title: string; [key: string]: unknown }[];
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class TmdbService {
  constructor(private http: HttpClient) {}

  /** Importa una sola página de populares (para flujo página a página con progreso). */
  importPopularPage(page: number): Observable<ImportPageResponse> {
    const params = new HttpParams().set('page', String(page));
    return this.http.post<ImportPageResponse>(`${environment.apiBaseUrl}/tmdb/import/popular/page`, null, { params });
  }

  importPopular(pages: number): Observable<ImportSummary> {
    return this.http.post<ImportSummary>(`${environment.apiBaseUrl}/tmdb/import/popular?pages=${pages}`, {});
  }

  importById(tmdbId: number) {
    return this.http.post(`${environment.apiBaseUrl}/tmdb/import/${tmdbId}`, {});
  }

  importPopularSummary(pages: number): Observable<ImportSummary> {
  const params = new HttpParams().set('pages', String(pages));
  return this.http.post<ImportSummary>(`${environment.apiBaseUrl}/tmdb/import/popular/summary`, null, { params });
  }
}
