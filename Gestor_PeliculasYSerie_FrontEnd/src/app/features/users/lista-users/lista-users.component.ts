import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDTO } from '../users';
import { UsersService } from '../service/users.service';

@Component({
  standalone: true,
  selector: 'app-lista-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-users.component.html',
  styleUrl: './lista-users.component.css'
})
export class ListaUsersComponent implements OnInit {
  loading = false;
  error = '';
  users: UserDTO[] = [];

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.usersSvc.getAll().subscribe({
      next: (rows) => {
        this.users = rows ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        // si backend devuelve 403/401:
        this.error = err?.status === 403
          ? 'No tienes permisos (solo ADMIN).'
          : err?.status === 401
            ? 'No has iniciado sesión.'
            : 'No se pudieron cargar los usuarios.';
      }
    });
  }
}
