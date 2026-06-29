import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4" *ngIf="order">
      <a routerLink="/orders" class="btn btn-sm btn-outline-secondary mb-3">← Back</a>
      <h5>Order #{{ order.orderNumber }}</h5>
      <div class="row">
        <div class="col-md-8">
          <div class="card p-3 mb-3">
            <h6>Items</h6>
            <table class="table table-sm">
              <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of order.items">
                  <td>{{ item.name }}</td>
                  <td>₱{{ item.price | number:'1.2-2' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₱{{ item.subtotal | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-end fw-bold">Total: ₱{{ order.total | number:'1.2-2' }}</div>
          </div>
          <div class="card p-3">
            <h6>Status History</h6>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" *ngFor="let h of order.statusHistory">
                <span class="badge bg-secondary me-2">{{ h.status }}</span>
                {{ h.changedAt | date:'medium' }}
                <span *ngIf="h.note" class="text-muted ms-2">— {{ h.note }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 mb-3">
            <h6>Shipping Address</h6>
            <p class="mb-1">{{ order.shippingAddress.fullName }}</p>
            <p class="mb-1">{{ order.shippingAddress.phone }}</p>
            <p class="mb-0">{{ order.shippingAddress.completeAddress }}, {{ order.shippingAddress.barangay }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.province }}</p>
          </div>
          <div class="card p-3">
            <h6>Status</h6>
            <span class="badge fs-6" [ngClass]="statusClass(order.status)">{{ order.status }}</span>
            <p class="mt-2 mb-0">Payment: {{ order.paymentMethod | uppercase }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  order: any = null;

  constructor(private route: ActivatedRoute, private orderSvc: OrderService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderSvc.getMyOrder(id).subscribe(res => this.order = res.data);
  }

  statusClass(status: string) {
    const map: any = { pending: 'bg-warning text-dark', shipped: 'bg-primary', delivered: 'bg-success', completed: 'bg-success', cancelled: 'bg-danger' };
    return map[status] || 'bg-secondary';
  }
}