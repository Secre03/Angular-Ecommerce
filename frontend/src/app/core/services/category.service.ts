import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private api: ApiService) {}
  getCategories() { return this.api.get<any>('/categories'); }
  createCategory(data: any) { return this.api.post<any>('/categories', data); }
  updateCategory(id: string, data: any) { return this.api.put<any>(`/categories/${id}`, data); }
  deleteCategory(id: string) { return this.api.delete<any>(`/categories/${id}`); }
}