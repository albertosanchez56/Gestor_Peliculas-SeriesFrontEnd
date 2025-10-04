import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:9090/tmdb'; // tu gateway

export interface ImportSummary {
  requested: number;
  created: number;
  updated: number;
  skipped: number;
  importedIds: number[];
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class TmdbService {
  constructor(private http: HttpClient) {}

  importPopular(pages: number): Observable<ImportSummary> {
    return this.http.post<ImportSummary>(`${BASE_URL}/import/popular?pages=${pages}`, {});
  }

  importById(tmdbId: number) {
    return this.http.post(`${BASE_URL}/import/${tmdbId}`, {});
  }

  importPopularSummary(pages: number): Observable<ImportSummary> {
  const params = new HttpParams().set('pages', String(pages));
  return this.http.post<ImportSummary>(`${BASE_URL}/import/popular/summary`, null, { params });
  }
}
