import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  unreadCount = signal<number>(0);
  constructor(private api: ApiService) {}

  getNotifications(params?: any) {
    return this.api.get<any>('/notifications', params).pipe(tap(res => this.unreadCount.set(res.meta?.unread || 0)));
  }
  markAsRead(id: string) { return this.api.put<any>(`/notifications/${id}/read`, {}); }
  markAllAsRead() { return this.api.put<any>('/notifications/read-all', {}).pipe(tap(() => this.unreadCount.set(0))); }
  deleteNotification(id: string) { return this.api.delete<any>(`/notifications/${id}`); }
}