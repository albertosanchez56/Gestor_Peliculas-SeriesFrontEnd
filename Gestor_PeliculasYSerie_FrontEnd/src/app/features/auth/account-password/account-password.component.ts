import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account-password.component.html',
  styleUrl: './account-password.component.css'
})
export class AccountPasswordComponent {
  loading = false;
  error = '';
  ok = '';

  form = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = '';
    this.ok = '';

    this.auth.changePassword(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Contraseña actualizada correctamente.';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/account']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'No se pudo cambiar la contraseña.';
      }
    });
  }
}
