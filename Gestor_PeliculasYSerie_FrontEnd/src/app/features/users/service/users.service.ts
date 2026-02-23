import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../users';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = `${environment.apiBaseUrl}/usuario/admin/users`;

  constructor(private http: HttpClient) { }

  list(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: 'ACTIVE' | 'BANNED') {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${id}/status`, { status });
  }

  updateRole(id: number, role: 'USER' | 'ADMIN') {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${id}/role`, { role });
  }
}
