

export class Users {
  id: number;
  username: string;
  email: string;      // opcional, solo si tu API lo devuelve
  avatarUrl: string;
  createdAt: string;  // mejor usar string para fechas (ISO-8601), ya lo puedes parsear luego
}