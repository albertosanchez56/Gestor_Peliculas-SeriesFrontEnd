
export interface UserInfo {
  id: number;
  username: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  user: UserInfo;
}

export interface LoginRequest {
  login: string;    // username o email
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}
