import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">User Management</h4>
      <div class="row g-2 mb-3">
        <div class="col-md-4">
          <input class="form-control" placeholder="Search name or email..." [(ngModel)]="search" (keyup.enter)="load()">
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="role" (change)="load()">
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" (click)="load()">Search</button>
        </div>
      </div>
      <table class="table bg-white">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td><span class="badge bg-secondary">{{ u.role }}</span></td>
            <td><span class="badge" [ngClass]="u.isActive ? 'bg-success' : 'bg-danger'">{{ u.isActive ? 'Active' : 'Inactive' }}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-danger" *ngIf="u.isActive && u.role !== 'admin'" (click)="toggle(u)">Deactivate</button>
              <button class="btn btn-sm btn-outline-success" *ngIf="!u.isActive" (click)="toggle(u)">Activate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  search = ''; role = '';

  constructor(private adminSvc: AdminService) {}

  ngOnInit() { this.load(); }

  load() {
    this.adminSvc.getUsers({ search: this.search || undefined, role: this.role || undefined })
      .subscribe(res => this.users = res.data);
  }

  toggle(u: any) {
    const action = u.isActive ? this.adminSvc.deactivateUser(u._id) : this.adminSvc.activateUser(u._id);
    action.subscribe(() => u.isActive = !u.isActive);
  }
}