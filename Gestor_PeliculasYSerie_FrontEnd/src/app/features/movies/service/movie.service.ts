import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movies } from '../movies';
import { MovieRequest } from '../MovieRequest';

export interface CastCredit {
  id: number;
  personName: string;
  characterName?: string;
  profileUrl?: string;
  orderIndex?: number;
}

export interface MovieSuggestionDTO {
  id: number;
  title: string;
  releaseDate?: string;
  posterUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = "http://localhost:9090/peliculas";

  constructor(private httpClient: HttpClient) { }

  obtenerListaDePeliculas(): Observable<Movies[]> {
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/mostrarpeliculas`);
  }

  getAll(page = 0, size = 20) {
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/mostrarpeliculas`, {
      params: { page, size }
    });
  }

  registrarPelicula(movie: MovieRequest): Observable<Movies> {
    return this.httpClient.post<Movies>(`${this.baseUrl}/guardarpeliculas`, movie);
  }

  actualizarPelicula(id: number, movie: Movies): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/peliculas/${id}`, movie);
  }

  obtenerPeliculaPorId(id: number): Observable<Movies> {
    return this.httpClient.get<Movies>(`${this.baseUrl}/peliculas/${id}`);
  }

  eliminarPelicula(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/peliculas/${id}`);
  }

  getPeliculas(page = 0, size = 50) {
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/mostrarpeliculas`, {
      params: { page, size }
    });
  }

  getTopRated(limit = 19): Observable<Movies[]> {
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/top-rated?limit=${limit}`);
  }

  getTopRatedByGenre(genreSlug: string, limit: number): Observable<Movies[]> {
    return this.httpClient.get<Movies[]>(
      `${this.baseUrl}/top-rated-by-genre`,
      { params: { genreSlug, limit: String(limit) } }
    );
  }

  getUpcoming(limit = 19): Observable<Movies[]> {
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/upcoming`, { params: { limit: String(limit) } });
  }

  getById(id: number): Observable<Movies> {
    return this.httpClient.get<Movies>(`${this.baseUrl}/peliculas/${id}`);
  }

  getCast(id: number): Observable<CastCredit[]> {
    return this.httpClient.get<CastCredit[]>(`${this.baseUrl}/cast/${id}`);
  }

  importCast(id: number, tmdbId: number) {
    return this.httpClient.post<CastCredit[]>(`${this.baseUrl}/cast/${id}/tmdb/${tmdbId}`, {});
  }

  searchSuggestions(q: string, size = 8) {
    return this.httpClient.get<MovieSuggestionDTO[]>(
      `${this.baseUrl}/search`,
      { params: { q, size } }
    );
  }
  getPeliculasBrowser(page: number, size: number, q?: string, genre?: string): Observable<Movies[]> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    if (q && q.trim().length) {
      params = params.set('q', q.trim());
    }
    if (genre && genre.trim().length) {
      params = params.set('genre', genre.trim());
    }
    return this.httpClient.get<Movies[]>(`${this.baseUrl}/peliculas`, { params });
  }




}
