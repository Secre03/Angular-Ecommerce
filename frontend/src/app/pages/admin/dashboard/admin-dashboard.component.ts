import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Admin Dashboard</h4>
      <div class="row g-3 mb-4" *ngIf="stats">
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.users.total }}</h5><small>Total Users</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.stores.pending }}</h5><small>Pending Stores</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.products.pending }}</h5><small>Pending Products</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>₱{{ stats.revenue | number:'1.0-0' }}</h5><small>Total Revenue</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.users.buyers }}</h5><small>Buyers</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.users.sellers }}</h5><small>Sellers</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.stores.approved }}</h5><small>Approved Stores</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.orders.total }}</h5><small>Total Orders</small></div></div>
      </div>
      <div class="row g-3">
        <div class="col-md-3"><a routerLink="/admin/users" class="btn btn-outline-primary w-100 py-3">Users</a></div>
        <div class="col-md-3"><a routerLink="/admin/stores" class="btn btn-outline-warning w-100 py-3">Stores</a></div>
        <div class="col-md-3"><a routerLink="/admin/products" class="btn btn-outline-success w-100 py-3">Products</a></div>
        <div class="col-md-3"><a routerLink="/admin/categories" class="btn btn-outline-secondary w-100 py-3">Categories</a></div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  constructor(private adminSvc: AdminService) {}
  ngOnInit() { this.adminSvc.getDashboard().subscribe(res => this.stats = res.data); }
}