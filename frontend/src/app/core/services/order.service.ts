import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  placeOrder(data: any) { return this.api.post<any>('/orders', data); }
  getMyOrders(params?: any) { return this.api.get<any>('/orders/my', params); }
  getMyOrder(id: string) { return this.api.get<any>(`/orders/my/${id}`); }
  cancelOrder(id: string, reason: string) { return this.api.put<any>(`/orders/my/${id}/cancel`, { reason }); }

  getSellerOrders(params?: any) { return this.api.get<any>('/orders/seller', params); }
  updateOrderStatus(id: string, status: string, note?: string) { return this.api.put<any>(`/orders/seller/${id}/status`, { status, note }); }

  getAllOrders(params?: any) { return this.api.get<any>('/orders/admin/all', params); }
}