// src/app/core/auth/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:9090/usuario/auth';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  private readonly isBrowser: boolean;

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // hidratar desde storage
    if (this.isBrowser) {
      const u = this.readUser();
      if (u) this.userSubject.next(u);
    }
  }

  register(dto: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginRequest): Observable<CurrentUser> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap(res => {
        this.saveToken(res.accessToken);
        this.saveUser(res.user);
      }),
      // devolvemos el usuario ya disponible
      tap(() => {}),
      // para tipado correcto:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tap(() => {}),
      // mapeo manual:
      // (más simple:)
      // return of(res.user)
    ) as unknown as Observable<CurrentUser>;
  }

  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`).pipe(
      tap(u => this.saveUser(u)),
      catchError(() => {
        this.clearSession();
        return of(null as any);
      })
    );
  }

  refreshSession(): Observable<CurrentUser | null> {
    if (!this.getToken()) return of(null);
    return this.me().pipe(catchError(() => of(null)));
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

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  private saveToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
  }

  private saveUser(u: CurrentUser): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.userKey, JSON.stringify(u));
    this.userSubject.next(u);
  }

  private readUser(): CurrentUser | null {
    try {
      if (!this.isBrowser) return null;
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as CurrentUser) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.userSubject.next(null);
  }
}