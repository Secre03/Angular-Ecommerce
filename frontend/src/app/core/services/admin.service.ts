import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}
  getDashboard() { return this.api.get<any>('/admin/dashboard'); }
  getUsers(params?: any) { return this.api.get<any>('/admin/users', params); }
  deactivateUser(id: string) { return this.api.put<any>(`/admin/users/${id}/deactivate`, {}); }
  activateUser(id: string) { return this.api.put<any>(`/admin/users/${id}/activate`, {}); }
}