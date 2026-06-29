import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private api: ApiService) {}

  getStores(params?: any) { return this.api.get<any>('/stores', params); }
  getStore(id: string) { return this.api.get<any>(`/stores/${id}`); }

  getMyStore() { return this.api.get<any>('/stores/my/store'); }
  createStore(data: any) { return this.api.post<any>('/stores', data); }
  updateStore(data: any) { return this.api.put<any>('/stores/my/store', data); }
  deleteStore() { return this.api.delete<any>('/stores/my/store'); }

  getAllStores(params?: any) { return this.api.get<any>('/admin/stores', params); }
  getPendingStores() { return this.api.get<any>('/admin/stores/pending'); }
  approveStore(id: string) { return this.api.put<any>(`/stores/${id}/approve`, {}); }
  rejectStore(id: string, reason: string) { return this.api.put<any>(`/stores/${id}/reject`, { reason }); }
  deactivateStore(id: string) { return this.api.put<any>(`/stores/${id}/deactivate`, {}); }
}