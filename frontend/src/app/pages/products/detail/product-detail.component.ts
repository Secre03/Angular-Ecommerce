import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [`
  #product-store-map {
    height: 280px;
    width: 100%;
    border-radius: 8px;
    margin-top: 12px;
    position: relative;
    z-index: 0;
  }
`],
  template: `
    <div class="container mt-4" *ngIf="product">
      <a routerLink="/products" class="btn btn-sm btn-outline-secondary mb-3">← Back to Products</a>

      <div class="row g-4">

        <!-- Images -->
        <div class="col-md-5">
          <div class="card p-3 text-center">
            <img
              *ngIf="product.images?.length"
              [src]="'/uploads/products/' + product.images[selectedImage]"
              class="img-fluid rounded mb-2"
              style="max-height:300px;object-fit:contain">
            <div
              *ngIf="!product.images?.length"
              class="text-muted py-5 bg-light rounded">
              No image available
            </div>
            <!-- Thumbnails -->
            <div class="d-flex gap-2 justify-content-center flex-wrap mt-2" *ngIf="product.images?.length > 1">
              <img
                *ngFor="let img of product.images; let i = index"
                [src]="'/uploads/products/' + img"
                (click)="selectedImage = i"
                class="rounded"
                [style.border]="selectedImage === i ? '2px solid #0d6efd' : '2px solid #dee2e6'"
                style="width:55px;height:55px;object-fit:cover;cursor:pointer">
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="col-md-7">
          <h4 class="fw-bold">{{ product.name }}</h4>

          <div class="d-flex gap-2 mb-2 flex-wrap">
            <span class="badge bg-light text-dark border">{{ product.category?.name }}</span>
            <span class="badge" [ngClass]="product.quantity > 0 ? 'bg-success' : 'bg-danger'">
              {{ product.quantity > 0 ? 'In Stock (' + product.quantity + ')' : 'Out of Stock' }}
            </span>
          </div>

          <div *ngIf="product.discount > 0" class="mb-1">
            <span class="text-decoration-line-through text-muted me-2">
              ₱{{ product.price | number:'1.2-2' }}
            </span>
            <span class="badge bg-danger">-{{ product.discount }}% OFF</span>
          </div>
          <h3 class="text-primary fw-bold mb-3">₱{{ product.discountedPrice | number:'1.2-2' }}</h3>

          <p class="text-muted mb-3">{{ product.description }}</p>

          <!-- Add to Cart -->
          <div *ngIf="auth.isBuyer && product.quantity > 0" class="d-flex gap-2 align-items-center mb-3">
            <div class="input-group" style="width:130px">
              <button class="btn btn-outline-secondary" (click)="decQty()">-</button>
              <input class="form-control text-center" [value]="qty" readonly>
              <button class="btn btn-outline-secondary" (click)="incQty()">+</button>
            </div>
            <button class="btn btn-success px-4" (click)="addToCart()">🛒 Add to Cart</button>
          </div>

          <div class="alert alert-success py-2" *ngIf="cartMsg">{{ cartMsg }}</div>

          <div class="alert alert-warning py-2 small" *ngIf="!auth.isLoggedIn">
            <a routerLink="/login">Login</a> to add items to cart.
          </div>

          <p class="text-muted small mb-0" *ngIf="product.sku">SKU: {{ product.sku }}</p>
        </div>
      </div>

      <!-- Store Info Card -->
      <div class="card mt-4 p-3" *ngIf="product.store">
        <h6 class="fw-bold mb-3">🏪 Sold by {{ product.store.name }}</h6>

        <div class="row g-2 mb-3">
          <div class="col-12" *ngIf="product.store.description">
            <p class="text-muted small mb-1">{{ product.store.description }}</p>
          </div>
          <div class="col-md-6" *ngIf="product.store.contactNumber">
            <span class="text-muted small">📞 Contact:</span>
            <strong class="ms-1">{{ product.store.contactNumber }}</strong>
          </div>
          <div class="col-md-6" *ngIf="product.store.email">
            <span class="text-muted small">📧 Email:</span>
            <span class="ms-1">{{ product.store.email }}</span>
          </div>
          <div class="col-12" *ngIf="product.store.location">
            <span class="text-muted small">📍 Address:</span>
            <span class="ms-1">
              {{ product.store.location.completeAddress }},
              {{ product.store.location.barangay }},
              {{ product.store.location.city }},
              {{ product.store.location.province }}
            </span>
          </div>
        </div>

        <!-- View Location Button -->
        <div *ngIf="hasLocation">
          <button
            class="btn btn-outline-primary btn-sm"
            (click)="toggleMap()"
            *ngIf="!mapVisible">
            🗺️ View Store Location on Map
          </button>
          <button
            class="btn btn-outline-secondary btn-sm"
            (click)="toggleMap()"
            *ngIf="mapVisible">
            ✕ Hide Map
          </button>
          <div id="product-store-map" *ngIf="mapVisible"></div>
        </div>

        <div *ngIf="!hasLocation" class="text-muted small mt-1">
          📍 Store location not available.
        </div>
      </div>

    </div>

    <!-- Not found -->
    <div class="container mt-4" *ngIf="!product && !loading">
      <div class="alert alert-warning">Product not found or no longer available.</div>
      <a routerLink="/products" class="btn btn-outline-secondary">← Back</a>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any = null;
  qty = 1;
  selectedImage = 0;
  loading = true;
  cartMsg = '';
  hasLocation = false;
  mapVisible = false;

  private map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private productSvc: ProductService,
    public cartSvc: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productSvc.getProduct(id).subscribe({
      next: res => {
        this.product = res.data;
        this.loading = false;
        const loc = this.product?.store?.location;
        this.hasLocation = !!(loc?.latitude && loc?.longitude);
      },
      error: () => this.loading = false
    });
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  toggleMap() {
  this.mapVisible = !this.mapVisible;
  if (this.mapVisible) {
    setTimeout(() => {
      this.initMap();
      // Force Leaflet to recalculate tile positions
      if (this.map) this.map.invalidateSize();
    }, 300);
  } else {
    if (this.map) {
      this.map.remove();
      this.map = undefined!;
    }
  }
}

  private initMap() {
  const loc = this.product.store.location;
  const lat = loc.latitude;
  const lng = loc.longitude;

  const mapEl = document.getElementById('product-store-map');
  if (!mapEl || this.map) return;

  this.map = L.map('product-store-map').setView([lat, lng], 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO',
  maxZoom: 19,
  subdomains: 'abcd',
}).addTo(this.map);
  const marker = L.marker([lat, lng]).addTo(this.map);
  marker.bindPopup(`
    <strong>🏪 ${this.product.store.name}</strong><br>
    ${loc.completeAddress || ''}<br>
    ${loc.barangay ? loc.barangay + ', ' : ''}${loc.city || ''}, ${loc.province || ''}<br>
    ${this.product.store.contactNumber ? '📞 ' + this.product.store.contactNumber : ''}
  `).openPopup();

  setTimeout(() => this.map.invalidateSize(), 100);
}

  decQty() { if (this.qty > 1) this.qty--; }
  incQty() { if (this.product && this.qty < this.product.quantity) this.qty++; }

  addToCart() {
    this.cartSvc.addToCart(this.product._id, this.qty).subscribe({
      next: () => {
        this.cartMsg = '✅ Added to cart!';
        setTimeout(() => this.cartMsg = '', 2500);
      },
      error: (err) => alert(err.error?.message || 'Failed to add to cart.')
    });
  }
}