import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loading = false;
  error = '';
  ok = '';

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
  if (this.form.invalid || this.loading) return;

  this.error = '';
  this.ok = '';
  this.loading = true;

  const username = this.form.value.username!;
  const dto = {
  username: this.form.value.username!,
  email: this.form.value.email!,
  displayName: this.form.value.displayName!,
  password: this.form.value.password!
};

  this.auth.register(dto).subscribe({
    next: () => {
      this.loading = false;
      this.ok = 'Cuenta creada. Ya puedes iniciar sesión.';
      setTimeout(() => this.router.navigate(['/login']), 700);
    },
    error: (err) => {
      this.loading = false;
      this.error = err?.error?.message ?? 'No se pudo registrar.';
    }
  });
}
}