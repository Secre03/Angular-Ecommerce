import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Seller Dashboard</h4>
      <div class="row g-3 mb-4" *ngIf="stats">
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.products.total }}</h5><small>Total Products</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.products.pending }}</h5><small>Pending Approval</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>{{ stats.orders.total }}</h5><small>Total Orders</small></div></div>
        <div class="col-6 col-md-3"><div class="card p-3 text-center"><h5>₱{{ stats.revenue | number:'1.0-0' }}</h5><small>Revenue</small></div></div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-md-4"><a routerLink="/seller/store" class="btn btn-outline-primary w-100 py-3">🏪 Manage Store</a></div>
        <div class="col-md-4"><a routerLink="/seller/products" class="btn btn-outline-success w-100 py-3">📦 My Products</a></div>
        <div class="col-md-4"><a routerLink="/seller/orders" class="btn btn-outline-warning w-100 py-3">📋 Manage Orders</a></div>
      </div>
      <div class="card p-3" *ngIf="stats?.recentOrders?.length">
        <h6>Recent Orders</h6>
        <table class="table table-sm">
          <thead><tr><th>Order #</th><th>Buyer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let o of stats.recentOrders">
              <td>{{ o.orderNumber }}</td>
              <td>{{ o.buyer?.name }}</td>
              <td>₱{{ o.total | number:'1.2-2' }}</td>
              <td><span class="badge bg-secondary">{{ o.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SellerDashboardComponent implements OnInit {
  stats: any = null;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any>('/seller/dashboard').subscribe(res => this.stats = res.data); }
}