import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Product Approvals</h4>
      <div class="mb-3">
        <select class="form-select w-auto" [(ngModel)]="filter" (change)="load()">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div class="alert alert-info" *ngIf="products.length === 0">No products found.</div>
      <table class="table bg-white" *ngIf="products.length > 0">
        <thead><tr><th>Product</th><th>Seller</th><th>Store</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td>{{ p.name }}</td>
            <td>{{ p.seller?.name }}</td>
            <td>{{ p.store?.name }}</td>
            <td>₱{{ p.discountedPrice | number:'1.2-2' }}</td>
            <td><span class="badge" [ngClass]="statusClass(p.status)">{{ p.status }}</span></td>
            <td>
              <button class="btn btn-sm btn-success me-1" *ngIf="p.status === 'pending'" (click)="approve(p)">Approve</button>
              <button class="btn btn-sm btn-danger" *ngIf="p.status === 'pending'" (click)="reject(p)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filter = 'pending';

  constructor(private productSvc: ProductService) {}

  ngOnInit() { this.load(); }

  load() {
    this.productSvc.getPendingProducts().subscribe(res => this.products = res.data);
  }

  approve(p: any) {
    this.productSvc.approveProduct(p._id).subscribe(() => { p.status = 'approved'; alert('Product approved!'); });
  }

  reject(p: any) {
    const reason = prompt('Rejection reason:');
    if (reason === null) return;
    this.productSvc.rejectProduct(p._id, reason).subscribe(() => { p.status = 'rejected'; alert('Product rejected.'); });
  }

  statusClass(s: string) {
    const map: any = { pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger' };
    return map[s] || 'bg-secondary';
  }
}