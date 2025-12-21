import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.loading = true;

    this.auth.login({ login: this.login, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/Home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Error al iniciar sesión';
      }
    });
  }
}
