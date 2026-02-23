import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Generos } from '../generos';

export interface GenreCard {
  id: number;
  name: string;
  slug: string;
  movieCount: number;
  posterUrl?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private baseUrl = `${environment.apiBaseUrl}/generos`;
  
    constructor(private httpClient : HttpClient) { }

    /** Géneros con conteo de películas (para tarjetas en home). */
    getGenreCards(): Observable<GenreCard[]> {
      return this.httpClient.get<GenreCard[]>(`${this.baseUrl}/cards`);
    }

    obtenerListaDeGeneros():Observable<Generos[]>{
        return this.httpClient.get<Generos[]>(`${this.baseUrl}/mostrargeneros`);
      }
    
      registrarGenero(generos:Generos):Observable<Generos>{
        return this.httpClient.post<Generos>(`${this.baseUrl}/guardargeneros`, generos);
      }
    
      actualizarGenero(id:number,generos:Generos) : Observable<Object>{
        return this.httpClient.put(`${this.baseUrl}/generos/${id}`, generos);
      }
    
      obtenerGeneroPorId(id:number): Observable<Generos>{
        return this.httpClient.get<Generos>(`${this.baseUrl}/generos/${id}`);
      }
    
      eliminarGenero(id:number): Observable<Object>{
        return this.httpClient.delete(`${this.baseUrl}/generos/${id}`);
      }

      checkIfNameExists(name: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.baseUrl}/generosexists/${name}`);
      }
      
}
