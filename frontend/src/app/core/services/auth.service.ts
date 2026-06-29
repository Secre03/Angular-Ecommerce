import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  _id: string; name: string; email: string; role: 'admin' | 'seller' | 'buyer'; photo?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadUser());
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private api: ApiService, private router: Router) {}

  private loadUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  register(data: any) {
    return this.api.post<any>('/auth/register', data).pipe(tap(res => this.saveSession(res)));
  }

  login(data: any) {
    return this.api.post<any>('/auth/login', data).pipe(tap(res => this.saveSession(res)));
  }

  logout() {
    this.api.post('/auth/logout', {}).subscribe();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.token.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    this.currentUser.set(res.data);
    this.token.set(res.token);
  }

  getMe() {
    return this.api.get<any>('/auth/me').pipe(tap(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
      this.currentUser.set(res.data);
    }));
  }

  updateProfile(data: any) { return this.api.put<any>('/auth/update-profile', data); }
  changePassword(data: any) { return this.api.put<any>('/auth/change-password', data); }

  get isLoggedIn() { return !!this.token(); }
  get role() { return this.currentUser()?.role; }
  get isAdmin() { return this.role === 'admin'; }
  get isSeller() { return this.role === 'seller'; }
  get isBuyer() { return this.role === 'buyer'; }
}