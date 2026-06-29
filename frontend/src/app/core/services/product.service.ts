import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(params?: any) { return this.api.get<any>('/products', params); }
  getProduct(id: string) { return this.api.get<any>(`/products/${id}`); }

  getMyProducts(params?: any) { return this.api.get<any>('/products/my/products', params); }
  getMyProduct(id: string) { return this.api.get<any>(`/products/my/products/${id}`); }
  createProduct(data: any) { return this.api.post<any>('/products', data); }
  updateProduct(id: string, data: any) { return this.api.put<any>(`/products/my/products/${id}`, data); }
  deleteProduct(id: string) { return this.api.delete<any>(`/products/my/products/${id}`); }
  uploadImages(id: string, fd: FormData) { return this.api.postUpload<any>(`/products/my/products/${id}/images`, fd); }

  getPendingProducts(params?: any) { return this.api.get<any>('/admin/products/pending', params); }
  approveProduct(id: string) { return this.api.put<any>(`/products/${id}/approve`, {}); }
  rejectProduct(id: string, reason: string) { return this.api.put<any>(`/products/${id}/reject`, { reason }); }
}