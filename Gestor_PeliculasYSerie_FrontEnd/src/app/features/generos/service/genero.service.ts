import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Generos } from '../generos';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private baseUrl = "http://localhost:9090/peliculas";
  
    constructor(private httpClient : HttpClient) { }

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
