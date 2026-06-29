import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-seller-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="page-title mb-0">My Products</h4>
        <a routerLink="/seller/products/new" class="btn btn-success">+ Add Product</a>
      </div>
      <div class="alert alert-info" *ngIf="products.length === 0 && !loading">No products yet.</div>
      <table class="table bg-white" *ngIf="products.length > 0">
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td>{{ p.name }}</td>
            <td>₱{{ p.discountedPrice | number:'1.2-2' }}</td>
            <td>{{ p.quantity }}</td>
            <td><span class="badge" [ngClass]="statusClass(p.status)">{{ p.status }}</span></td>
            <td>
              <a [routerLink]="['/seller/products/edit', p._id]" class="btn btn-sm btn-outline-primary me-1">Edit</a>
              <button class="btn btn-sm btn-outline-danger" (click)="delete(p)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SellerProductListComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(private productSvc: ProductService) {}

  ngOnInit() {
    this.productSvc.getMyProducts().subscribe(res => { this.products = res.data; this.loading = false; });
  }

  delete(p: any) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    this.productSvc.deleteProduct(p._id).subscribe(() => this.products = this.products.filter(x => x._id !== p._id));
  }

  statusClass(s: string) {
    const map: any = { pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger', hidden: 'bg-secondary', out_of_stock: 'bg-dark' };
    return map[s] || 'bg-secondary';
  }
}