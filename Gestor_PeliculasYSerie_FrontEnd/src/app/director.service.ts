import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Director } from './director';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  private baseUrl = "http://localhost:9090/peliculas";

  constructor(private httpClient : HttpClient) { }

  obtenerListaDeDirectores():Observable<Director[]>{
    return this.httpClient.get<Director[]>(`${this.baseUrl}/mostrardirectores`);
  }

  registrarDirector(director:Director):Observable<Director>{
    return this.httpClient.post<Director>(`${this.baseUrl}/guardardirectores`, director);
  }

  actualizarDirector(id:number,director:Director) : Observable<Object>{
    return this.httpClient.put(`${this.baseUrl}/directores/${id}`, director);
  }

  obtenerDirectorPorId(id:number): Observable<Director>{
    return this.httpClient.get<Director>(`${this.baseUrl}/directores/${id}`);
  }

  eliminarDirector(id:number): Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/directores/${id}`);
  }
}
