import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movies } from '../movies';
import { MovieRequest } from '../MovieRequest';


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
}
