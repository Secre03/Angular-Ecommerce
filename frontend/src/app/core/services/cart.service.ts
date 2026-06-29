import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartCount = signal<number>(0);

  constructor(private api: ApiService) {}

  getCart() {
    return this.api.get<any>('/cart').pipe(tap(res => this.cartCount.set(res.data?.items?.length || 0)));
  }
  addToCart(productId: string, quantity = 1) {
    return this.api.post<any>('/cart/add', { productId, quantity }).pipe(tap(res => this.cartCount.set(res.data?.items?.length || 0)));
  }
  updateItem(itemId: string, quantity: number) {
    return this.api.put<any>(`/cart/item/${itemId}`, { quantity }).pipe(tap(res => this.cartCount.set(res.data?.items?.length || 0)));
  }
  removeItem(itemId: string) {
    return this.api.delete<any>(`/cart/item/${itemId}`).pipe(tap(res => this.cartCount.set(res.data?.items?.length || 0)));
  }
  clearCart() { return this.api.delete<any>('/cart/clear').pipe(tap(() => this.cartCount.set(0))); }
}