import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private api: ApiService) {}
  getAddresses() { return this.api.get<any>('/addresses'); }
  addAddress(data: any) { return this.api.post<any>('/addresses', data); }
  updateAddress(id: string, data: any) { return this.api.put<any>(`/addresses/${id}`, data); }
  deleteAddress(id: string) { return this.api.delete<any>(`/addresses/${id}`); }
  setDefault(id: string) { return this.api.put<any>(`/addresses/${id}/default`, {}); }
}