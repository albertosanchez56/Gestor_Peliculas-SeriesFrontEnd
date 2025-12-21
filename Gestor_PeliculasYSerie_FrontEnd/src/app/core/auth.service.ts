// src/app/core/auth/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, LoginRequest, UserInfo } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:9090/usuario';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  private readonly isBrowser: boolean;

  private userSubject: BehaviorSubject<UserInfo | null>;

  user$: Observable<UserInfo | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // 👇 Importante: no leer localStorage si no es browser
    const initialUser = this.isBrowser ? this.readUserFromStorage() : null;

    this.userSubject = new BehaviorSubject<UserInfo | null>(initialUser);
    this.user$ = this.userSubject.asObservable();
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, req).pipe(
      tap(res => {
        this.saveToken(res.accessToken);
        this.saveUser(res.user);
        this.userSubject.next(res.user);
      })
    );
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): UserInfo | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }

  // Opcional: validar token al arrancar
  loadMe(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/auth/me`).pipe(
      tap({
        next: user => {
          this.saveUser(user);
          this.userSubject.next(user);
        },
        error: () => this.logout()
      })
    );
  }

  private saveToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
  }

  private saveUser(user: UserInfo): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private readUserFromStorage(): UserInfo | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserInfo;
    } catch {
      return null;
    }
  }
}
