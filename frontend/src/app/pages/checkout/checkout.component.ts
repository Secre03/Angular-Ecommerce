import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AddressService } from '../../core/services/address.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Checkout</h4>
      <div class="row">

        <!-- LEFT: Address -->
        <div class="col-md-7">
          <div class="card p-3 mb-3">
            <h6 class="mb-3">Shipping Address</h6>

            <!-- Has saved address -->
            <div *ngIf="savedAddress" class="mb-3">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="useSaved"
                  [(ngModel)]="useSavedAddress" (change)="onToggleSaved()">
                <label class="form-check-label fw-semibold" for="useSaved">
                  Use my saved address
                </label>
              </div>
              <div class="border rounded p-2 bg-light text-muted small" *ngIf="useSavedAddress">
                <strong>{{ savedAddress.fullName }}</strong> — {{ savedAddress.phone }}<br>
                {{ savedAddress.completeAddress }}, {{ savedAddress.barangay }},
                {{ savedAddress.city }}, {{ savedAddress.province }}
                <span *ngIf="savedAddress.zipCode"> {{ savedAddress.zipCode }}</span>
              </div>
            </div>

            <!-- No saved address notice -->
            <div *ngIf="!savedAddress" class="alert alert-info py-2 small">
              No saved address yet. Fill in below — it will be saved automatically for next time.
            </div>

            <!-- Address form (hidden when useSavedAddress is checked) -->
            <div *ngIf="!useSavedAddress">
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label">Full Name *</label>
                  <input class="form-control" [(ngModel)]="form.fullName" placeholder="Lebron James">
                </div>
                <div class="col-6">
                  <label class="form-label">Phone *</label>
                  <input class="form-control" [(ngModel)]="form.phone" placeholder="09XXXXXXXXX">
                </div>
                <div class="col-6">
                  <label class="form-label">Province *</label>
                  <input class="form-control" [(ngModel)]="form.province" placeholder="Albay">
                </div>
                <div class="col-6">
                  <label class="form-label">City *</label>
                  <input class="form-control" [(ngModel)]="form.city" placeholder="Legazpi City">
                </div>
                <div class="col-6">
                  <label class="form-label">Barangay *</label>
                  <input class="form-control" [(ngModel)]="form.barangay" placeholder="Sagpon">
                </div>
                <div class="col-6">
                  <label class="form-label">Zip Code</label>
                  <input class="form-control" [(ngModel)]="form.zipCode" placeholder="4500">
                </div>
                <div class="col-12">
                  <label class="form-label">Complete Address *</label>
                  <input class="form-control" [(ngModel)]="form.completeAddress" placeholder="123 Main St">
                </div>
                <div class="col-12">
                  <div class="form-check mt-1">
                    <input class="form-check-input" type="checkbox" id="saveAddr" [(ngModel)]="saveAddressForNext">
                    <label class="form-check-label small" for="saveAddr">
                      Save this address for future orders
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes always visible -->
            <div class="mt-3">
              <label class="form-label">Order Notes <span class="text-muted small">(optional)</span></label>
              <textarea class="form-control" [(ngModel)]="form.notes" rows="2"
                placeholder="Leave at gate, call upon arrival, etc."></textarea>
            </div>
          </div>
        </div>

        <!-- RIGHT: Order Summary -->
        <div class="col-md-5">
          <div class="card p-3">
            <h6 class="mb-3">Order Summary</h6>

            <div *ngIf="cartItems.length === 0" class="text-muted small">Your cart is empty.</div>

            <div *ngFor="let item of cartItems" class="d-flex justify-content-between mb-2 small">
              <span class="text-truncate me-2" style="max-width:180px">
                {{ item.product?.name }} <span class="text-muted">x{{ item.quantity }}</span>
              </span>
              <span class="fw-semibold text-nowrap">₱{{ item.subtotal | number:'1.2-2' }}</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span class="text-primary">₱{{ total | number:'1.2-2' }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label">Payment Method</label>
              <select class="form-select" [(ngModel)]="paymentMethod">
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            <div class="alert alert-danger py-2 small" *ngIf="error">{{ error }}</div>

            <button class="btn btn-primary w-100" (click)="placeOrder()"
              [disabled]="loading || cartItems.length === 0">
              <span *ngIf="!loading">Place Order →</span>
              <span *ngIf="loading">Placing Order...</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  savedAddress: any = null;
  useSavedAddress = false;
  saveAddressForNext = true;
  total = 0;
  paymentMethod = 'cod';
  error = '';
  loading = false;

  form = {
    fullName: '', phone: '', province: '', city: '',
    barangay: '', completeAddress: '', zipCode: '', notes: ''
  };

  constructor(
    private cartSvc: CartService,
    private orderSvc: OrderService,
    private addrSvc: AddressService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSvc.getCart().subscribe(res => {
      this.cartItems = res.data?.items || [];
      this.total = res.data?.total || 0;
    });

    this.addrSvc.getAddresses().subscribe(res => {
      const addresses: any[] = res.data || [];
      if (addresses.length > 0) {
        this.savedAddress = addresses.find(a => a.isDefault) || addresses[0];
        this.useSavedAddress = true;
        this.fillFromSaved();
      }
    });
  }

  onToggleSaved() {
    if (this.useSavedAddress) {
      this.fillFromSaved();
    } else {
      this.form = {
        fullName: '', phone: '', province: '', city: '',
        barangay: '', completeAddress: '', zipCode: '', notes: ''
      };
    }
  }

  fillFromSaved() {
    if (!this.savedAddress) return;
    this.form = {
      fullName: this.savedAddress.fullName,
      phone: this.savedAddress.phone,
      province: this.savedAddress.province,
      city: this.savedAddress.city,
      barangay: this.savedAddress.barangay,
      completeAddress: this.savedAddress.completeAddress,
      zipCode: this.savedAddress.zipCode || '',
      notes: '',
    };
  }

  private getShippingAddress() {
    if (this.useSavedAddress && this.savedAddress) {
      return {
        fullName: this.savedAddress.fullName,
        phone: this.savedAddress.phone,
        province: this.savedAddress.province,
        city: this.savedAddress.city,
        barangay: this.savedAddress.barangay,
        completeAddress: this.savedAddress.completeAddress,
        zipCode: this.savedAddress.zipCode || '',
        notes: this.form.notes,
      };
    }
    return { ...this.form };
  }

  private saveAddress() {
    this.addrSvc.addAddress({
      fullName: this.form.fullName,
      phone: this.form.phone,
      province: this.form.province,
      city: this.form.city,
      barangay: this.form.barangay,
      completeAddress: this.form.completeAddress,
      zipCode: this.form.zipCode,
      isDefault: true,
      label: 'home',
    }).subscribe();
  }

  placeOrder() {
    const shipping = this.getShippingAddress();

    if (!shipping.fullName || !shipping.phone || !shipping.province ||
        !shipping.city || !shipping.barangay || !shipping.completeAddress) {
      this.error = 'Please fill in all required address fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.orderSvc.placeOrder({ shippingAddress: shipping, paymentMethod: this.paymentMethod }).subscribe({
      next: () => {
        if (!this.useSavedAddress && this.saveAddressForNext && !this.savedAddress) {
          this.saveAddress();
        }
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to place order.';
        this.loading = false;
      }
    });
  }
}