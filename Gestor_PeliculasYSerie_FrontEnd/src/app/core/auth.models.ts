// src/app/core/auth.models.ts
export type UserRole = 'ADMIN' | 'USER';

export interface CurrentUser {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
  email?: string; // opcional si lo devuelves
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;           // "Bearer"
  expiresInSeconds: number;
  user: CurrentUser;
}

export interface LoginRequest {
  login: string;               // username o email (según tu back)
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

