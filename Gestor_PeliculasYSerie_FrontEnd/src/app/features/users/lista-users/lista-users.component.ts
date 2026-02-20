import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../users';
import { UsersService } from '../service/users.service';

@Component({
  standalone: true,
  selector: 'app-lista-users',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-users.component.html',
  styleUrl: './lista-users.component.css'
})
export class ListaUsersComponent implements OnInit {
  users: UserDTO[] = [];
  searchInput = '';
  loading = false;
  error = '';
  rowBusy: Record<number, boolean> = {};

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.load();
  }

  get filteredUsers(): UserDTO[] {
    const q = this.searchInput.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      (u.username ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.displayName ?? '').toLowerCase().includes(q)
    );
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.usersSvc.list().subscribe({
      next: (rows) => {
        this.users = rows ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'No se pudieron cargar los usuarios.';
      }
    });
  }

  toggleStatus(u: UserDTO): void {
    const id = u.id;
    const nextStatus: 'ACTIVE' | 'BANNED' = (u.status === 'BANNED') ? 'ACTIVE' : 'BANNED';

    this.rowBusy[id] = true;
    this.error = '';

    this.usersSvc.updateStatus(id, nextStatus).subscribe({
      next: (updated) => {
        u.status = updated.status;
        this.rowBusy[id] = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo cambiar el estado.';
        this.rowBusy[id] = false;
      }
    });
  }

  toggleRole(u: UserDTO): void {
    const id = u.id;
    const nextRole: 'USER' | 'ADMIN' = (u.role === 'ADMIN') ? 'USER' : 'ADMIN';

    this.rowBusy[id] = true;
    this.error = '';

    this.usersSvc.updateRole(id, nextRole).subscribe({
      next: (updated) => {
        u.role = updated.role;
        this.rowBusy[id] = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo cambiar el rol.';
        this.rowBusy[id] = false;
      }
    });
  }

  busy(u: UserDTO): boolean {
    return !!this.rowBusy[u.id];
  }
}
