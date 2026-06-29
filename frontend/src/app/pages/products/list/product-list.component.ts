import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Browse Products</h4>
      <div class="row g-2 mb-3">
        <div class="col-md-5">
          <input class="form-control" placeholder="Search products..." [(ngModel)]="search" (keyup.enter)="load()">
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="category" (change)="load()">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c._id">{{ c.name }}</option>
          </select>
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" (click)="load()">Search</button>
        </div>
      </div>

      <div class="alert alert-info" *ngIf="!loading && products.length === 0">No products found.</div>
      <div class="row row-cols-2 row-cols-md-4 g-3">
        <div class="col" *ngFor="let p of products">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="card-title">{{ p.name }}</h6>
              <p class="text-muted small mb-1">{{ p.category?.name }}</p>
              <div *ngIf="p.discount > 0">
                <span class="text-decoration-line-through text-muted small">₱{{ p.price }}</span>
                <span class="badge bg-danger ms-1">-{{ p.discount }}%</span>
              </div>
              <p class="fw-bold text-primary mb-2">₱{{ p.discountedPrice | number:'1.2-2' }}</p>
              <p class="small text-muted mb-2">Stock: {{ p.quantity }}</p>
              <a [routerLink]="['/products', p._id]" class="btn btn-sm btn-outline-primary me-1">View</a>
              <button class="btn btn-sm btn-success" *ngIf="auth.isBuyer" (click)="addToCart(p._id)" [disabled]="p.quantity === 0">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav class="mt-4" *ngIf="meta.totalPages > 1">
        <ul class="pagination">
          <li class="page-item" [class.disabled]="page === 1">
            <button class="page-link" (click)="changePage(page-1)">Prev</button>
          </li>
          <li class="page-item" *ngFor="let p of pageArray" [class.active]="p === page">
            <button class="page-link" (click)="changePage(p)">{{ p }}</button>
          </li>
          <li class="page-item" [class.disabled]="page === meta.totalPages">
            <button class="page-link" (click)="changePage(page+1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  meta: any = {};
  search = ''; category = ''; page = 1; loading = false;

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    public cartSvc: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.categorySvc.getCategories().subscribe(res => this.categories = res.data);
    this.load();
  }

  load() {
    this.loading = true;
    this.productSvc.getProducts({ page: this.page, limit: 12, search: this.search || undefined, category: this.category || undefined })
      .subscribe(res => { this.products = res.data; this.meta = res.meta; this.loading = false; });
  }

  changePage(p: number) { if (p < 1 || p > this.meta.totalPages) return; this.page = p; this.load(); }

  get pageArray() { return Array.from({ length: this.meta.totalPages }, (_, i) => i + 1); }

  addToCart(productId: string) {
    this.cartSvc.addToCart(productId).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => alert(err.error?.message || 'Failed to add.')
    });
  }
}