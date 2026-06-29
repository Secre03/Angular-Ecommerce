import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5" style="max-width:440px">
      <div class="card p-4">
        <h3 class="mb-3 text-center">Create Account</h3>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">Registered! Redirecting...</div>
        <form (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input class="form-control" [(ngModel)]="form.name" name="name" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required>
            <small class="text-muted">Min 8 chars, 1 uppercase, 1 number</small>
          </div>
          <div class="mb-3">
            <label class="form-label">Register as</label>
            <select class="form-select" [(ngModel)]="form.role" name="role">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <button class="btn btn-success w-100" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0">Have account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = { name: '', email: '', password: '', role: 'buyer' };
  error = ''; success = false; loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = ''; this.loading = true;
    this.auth.register(this.form).subscribe({
      next: (res) => {
        this.success = true;
        setTimeout(() => {
          if (res.data.role === 'seller') this.router.navigate(['/seller/dashboard']);
          else this.router.navigate(['/products']);
        }, 1000);
      },
      error: (err) => { this.error = err.error?.message || 'Registration failed.'; this.loading = false; }
    });
  }
}