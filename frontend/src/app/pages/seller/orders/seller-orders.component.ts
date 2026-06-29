import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Manage Orders</h4>
      <div class="alert alert-info" *ngIf="orders.length === 0 && !loading">No orders yet.</div>
      <table class="table bg-white" *ngIf="orders.length > 0">
        <thead><tr><th>Order #</th><th>Buyer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          <tr *ngFor="let o of orders">
            <td>{{ o.orderNumber }}</td>
            <td>{{ o.buyer?.name }}</td>
            <td>{{ o.items?.length }}</td>
            <td>₱{{ o.total | number:'1.2-2' }}</td>
            <td><span class="badge" [ngClass]="statusClass(o.status)">{{ o.status }}</span></td>
            <td>
              <select class="form-select form-select-sm" style="width:140px" (change)="updateStatus(o, $event)">
                <option value="">Change...</option>
                <option *ngFor="let s of nextStatuses(o.status)" [value]="s">{{ s }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SellerOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderSvc: OrderService) {}

  ngOnInit() {
    this.orderSvc.getSellerOrders().subscribe(res => { this.orders = res.data; this.loading = false; });
  }

  nextStatuses(current: string): string[] {
    const flow: any = {
      pending: ['approved', 'cancelled'],
      approved: ['processing', 'cancelled'],
      processing: ['packed'],
      packed: ['shipped'],
      shipped: ['delivered'],
      delivered: ['completed'],
      refund_requested: ['refunded'],
    };
    return flow[current] || [];
  }

  updateStatus(order: any, event: any) {
    const status = event.target.value;
    if (!status) return;
    const note = prompt(`Note for "${status}" (optional):`) || '';
    this.orderSvc.updateOrderStatus(order._id, status, note).subscribe({
      next: () => { order.status = status; event.target.value = ''; alert('Status updated!'); },
      error: err => { alert(err.error?.message); event.target.value = ''; }
    });
  }

  statusClass(s: string) {
    const map: any = { pending: 'bg-warning text-dark', approved: 'bg-info text-dark', processing: 'bg-info text-dark', packed: 'bg-secondary', shipped: 'bg-primary', delivered: 'bg-success', completed: 'bg-success', cancelled: 'bg-danger' };
    return map[s] || 'bg-secondary';
  }
}