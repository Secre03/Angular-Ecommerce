import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="page-title mb-0">Notifications</h4>
        <button class="btn btn-sm btn-outline-secondary" (click)="markAll()" *ngIf="notifications.length">Mark All Read</button>
      </div>
      <div class="alert alert-info" *ngIf="notifications.length === 0">No notifications.</div>
      <div class="list-group">
        <div *ngFor="let n of notifications"
          class="list-group-item d-flex justify-content-between align-items-start"
          [class.fw-bold]="!n.isRead">
          <div>
            <p class="mb-1">{{ n.title }}</p>
            <small class="text-muted">{{ n.message }}</small><br>
            <small class="text-muted">{{ n.createdAt | date:'medium' }}</small>
          </div>
          <div class="d-flex gap-1 ms-2">
            <button class="btn btn-sm btn-outline-secondary" *ngIf="!n.isRead" (click)="markRead(n)">Mark Read</button>
            <button class="btn btn-sm btn-outline-danger" (click)="delete(n)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notifSvc: NotificationService) {}

  ngOnInit() { this.load(); }

  load() { this.notifSvc.getNotifications().subscribe(res => this.notifications = res.data); }

  markRead(n: any) { this.notifSvc.markAsRead(n._id).subscribe(() => n.isRead = true); }

  markAll() { this.notifSvc.markAllAsRead().subscribe(() => this.notifications.forEach(n => n.isRead = true)); }

  delete(n: any) { this.notifSvc.deleteNotification(n._id).subscribe(() => this.notifications = this.notifications.filter(x => x._id !== n._id)); }
}