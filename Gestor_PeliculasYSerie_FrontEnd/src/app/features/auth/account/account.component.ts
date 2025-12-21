import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="login-card">
    <h2>Mi cuenta</h2>

    <ng-container *ngIf="auth.getUser() as u; else noUser">
      <p><b>Usuario:</b> {{ u.username }}</p>
      <p><b>Nombre:</b> {{ u.displayName }}</p>
      <p><b>Rol:</b> {{ u.role }}</p>

      <button type="button" (click)="logout()">Cerrar sesión</button>
    </ng-container>

    <ng-template #noUser>
      <p>No hay sesión activa.</p>
      <a routerLink="/login">Ir a login</a>
    </ng-template>
  </div>
  `
})
export class AccountComponent {
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
