import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">My Cart</h4>
      <div class="alert alert-info" *ngIf="items.length === 0">Your cart is empty. <a routerLink="/products">Shop now</a></div>
      <div *ngIf="items.length > 0">
        <table class="table table-bordered bg-white">
          <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.product?.name || 'Product' }}</td>
              <td>₱{{ item.price | number:'1.2-2' }}</td>
              <td>
                <div class="d-flex align-items-center gap-1">
                  <button class="btn btn-sm btn-outline-secondary" (click)="update(item, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                  <span>{{ item.quantity }}</span>
                  <button class="btn btn-sm btn-outline-secondary" (click)="update(item, item.quantity + 1)">+</button>
                </div>
              </td>
              <td>₱{{ item.subtotal | number:'1.2-2' }}</td>
              <td><button class="btn btn-sm btn-danger" (click)="remove(item._id)">Remove</button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colspan="3" class="text-end fw-bold">Total</td><td class="fw-bold">₱{{ total | number:'1.2-2' }}</td><td></td></tr>
          </tfoot>
        </table>
        <div class="d-flex justify-content-between">
          <button class="btn btn-outline-danger" (click)="clear()">Clear Cart</button>
          <a routerLink="/checkout" class="btn btn-primary">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total = 0;

  constructor(private cartSvc: CartService) {}

  ngOnInit() { this.load(); }

  load() {
    this.cartSvc.getCart().subscribe(res => {
      this.items = res.data?.items || [];
      this.total = res.data?.total || 0;
    });
  }

  update(item: any, qty: number) {
    if (qty < 1) return;
    this.cartSvc.updateItem(item._id, qty).subscribe(() => this.load());
  }

  remove(itemId: string) { this.cartSvc.removeItem(itemId).subscribe(() => this.load()); }

  clear() {
    if (confirm('Clear all items?')) this.cartSvc.clearCart().subscribe(() => this.load());
  }
}