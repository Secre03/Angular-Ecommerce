import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5" style="max-width:420px">
      <div class="card p-4">
        <h3 class="mb-3 text-center">Login</h3>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
        <form (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" [(ngModel)]="form.rememberMe" name="rememberMe" id="rememberMe">
            <label class="form-check-label" for="rememberMe">Remember Me (30 days)</label>
          </div>
          <button class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0">No account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = { email: '', password: '', rememberMe: false };
  error = ''; loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = ''; this.loading = true;
    this.auth.login(this.form).subscribe({
      next: (res) => {
        const role = res.data.role;
        if (role === 'admin') this.router.navigate(['/admin/dashboard']);
        else if (role === 'seller') this.router.navigate(['/seller/dashboard']);
        else this.router.navigate(['/products']);
      },
      error: (err) => { this.error = err.error?.message || 'Login failed.'; this.loading = false; }
    });
  }
}