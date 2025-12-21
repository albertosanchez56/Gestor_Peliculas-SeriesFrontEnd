export interface LoginRequest {
  login: string;        // (o el nombre que use tu backend: login / usernameOrEmail)
  password: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  displayName: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;           // "Bearer"
  expiresInSeconds: number;
  user: CurrentUser;
}

export interface RegisterRequest {
  username: string;
  email: string;
  displayName: string;
  password: string;
}
