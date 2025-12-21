import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  displayName = '';
  password = '';
  confirmPassword = '';

  loading = false;
  error = '';
  ok = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.ok = '';

    const u = this.username.trim();
    const e = this.email.trim();

    if (!u || !e || !this.password) {
      this.error = 'Rellena usuario, email y contraseña.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.auth.register({
      username: u,
      email: e,
      password: this.password,
      displayName: this.displayName.trim() || undefined
    }).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Cuenta creada. Ya puedes iniciar sesión.';
        // opcional: ir al login directamente
        setTimeout(() => this.router.navigate(['/login']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Error al registrar el usuario';
      }
    });
  }
}
