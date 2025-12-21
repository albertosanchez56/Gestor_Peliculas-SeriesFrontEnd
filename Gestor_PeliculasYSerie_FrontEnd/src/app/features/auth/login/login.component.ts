import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  error = '';

  form = new FormGroup({
    usernameOrEmail: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
  if (this.form.invalid || this.loading) return;

  this.error = '';
  this.loading = true;

  const dto = {
  login: this.form.value.usernameOrEmail!, // lo mapeas a login
  password: this.form.value.password!
};

  this.auth.login(dto).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/Home']);
    },
    error: (err) => {
      this.loading = false;
      this.error = err?.error?.message ?? 'Login incorrecto.';
    }
  });
}
}
