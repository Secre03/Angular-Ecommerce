import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">My Orders</h4>
      <div class="alert alert-info" *ngIf="orders.length === 0 && !loading">No orders yet.</div>
      <table class="table bg-white" *ngIf="orders.length > 0">
        <thead><tr><th>Order #</th><th>Store</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let o of orders">
            <td>{{ o.orderNumber }}</td>
            <td>{{ o.store?.name }}</td>
            <td>₱{{ o.total | number:'1.2-2' }}</td>
            <td><span class="badge" [ngClass]="statusClass(o.status)">{{ o.status }}</span></td>
            <td>{{ o.createdAt | date:'mediumDate' }}</td>
            <td>
              <a [routerLink]="['/orders', o._id]" class="btn btn-sm btn-outline-primary me-1">View</a>
              <button class="btn btn-sm btn-outline-danger" *ngIf="canCancel(o.status)" (click)="cancel(o)">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderSvc: OrderService) {}

  ngOnInit() {
    this.orderSvc.getMyOrders().subscribe(res => { this.orders = res.data; this.loading = false; });
  }

  canCancel(status: string) { return ['pending', 'approved'].includes(status); }

  cancel(order: any) {
    const reason = prompt('Reason for cancellation:');
    if (reason === null) return;
    this.orderSvc.cancelOrder(order._id, reason).subscribe({
      next: () => { order.status = 'cancelled'; alert('Order cancelled.'); },
      error: (err) => alert(err.error?.message)
    });
  }

  statusClass(status: string) {
    const map: any = {
      pending: 'bg-warning text-dark', approved: 'bg-info text-dark',
      processing: 'bg-info text-dark', packed: 'bg-secondary',
      shipped: 'bg-primary', delivered: 'bg-success',
      completed: 'bg-success', cancelled: 'bg-danger',
      returned: 'bg-danger', refunded: 'bg-dark'
    };
    return map[status] || 'bg-secondary';
  }
}