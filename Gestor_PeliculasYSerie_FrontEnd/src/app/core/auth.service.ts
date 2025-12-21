// src/app/core/auth/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:9090/usuario/auth';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly browser: boolean;

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.browser = isPlatformBrowser(platformId);

    if (this.browser) {
      const u = this.readUser();
      if (u) this.userSubject.next(u);
    }
  }

  register(dto: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginRequest): Observable<CurrentUser> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap((res: AuthResponse) => {
        this.saveToken(res.accessToken);
        this.saveUser(res.user);
      }),
      map((res: AuthResponse) => res.user)
    );
  }

  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`).pipe(
      tap((u: CurrentUser) => this.saveUser(u))
    );
  }

  loadMe(): Observable<CurrentUser | null> {
    if (!this.isLoggedIn()) return of(null);
    return this.me();
  }

  logout(): void {
    this.clearSession();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }

  getCurrentUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    if (!this.browser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  private saveToken(token: string): void {
    if (!this.browser) return;
    localStorage.setItem(this.tokenKey, token);
  }

  private saveUser(u: CurrentUser): void {
    if (!this.browser) return;
    localStorage.setItem(this.userKey, JSON.stringify(u));
    this.userSubject.next(u);
  }

  private readUser(): CurrentUser | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as CurrentUser) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    if (this.browser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.userSubject.next(null);
  }
}