import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css'
})
export class AccountEditComponent implements OnInit {
  loading = false;
  error = '';
  ok = '';

  form = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const u = this.auth.getCurrentUser();
    if (u) {
      this.form.patchValue({
        displayName: u.displayName
      });
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = '';
    this.ok = '';

    this.auth.updateProfile(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.ok = 'Perfil actualizado correctamente.';
        setTimeout(() => this.router.navigate(['/account']), 800);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'No se pudo actualizar el perfil.';
      }
    });
  }
}
