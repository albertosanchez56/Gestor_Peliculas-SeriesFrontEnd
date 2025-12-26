import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';


function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!pass || !confirm) return null;
  return pass === confirm ? null : { passwordMismatch: true };
}

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

  form = new FormGroup(
    {
      displayName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      })
    },
    { validators: [passwordsMatch] }
  );

  constructor(private auth: AuthService, private router: Router) {}

  // helpers para template
  get f() { return this.form.controls; }
  touchedInvalid(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
  get passwordMismatch(): boolean {
    return this.form.touched && !!this.form.errors?.['passwordMismatch'];
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.ok = '';
    this.loading = true;

    const dto = {
      displayName: this.f.displayName.value.trim(),
      username: this.f.username.value.trim(),
      email: this.f.email.value.trim(),
      password: this.f.password.value
    };

    this.auth.register(dto).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Cuenta creada. Ya puedes iniciar sesión.';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/login']), 700);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'No se pudo registrar.';
      }
    });
  }
}