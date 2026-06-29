import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-admin-stores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Store Management</h4>
      <div class="mb-3">
        <select class="form-select w-auto" [(ngModel)]="filter" (change)="load()">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="deactivated">Deactivated</option>
          <option value="">All</option>
        </select>
      </div>
      <table class="table bg-white">
        <thead><tr><th>Store</th><th>Owner</th><th>Location</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let s of stores">
            <td>{{ s.name }}</td>
            <td>{{ s.owner?.name }}</td>
            <td>{{ s.location?.city }}, {{ s.location?.province }}</td>
            <td><span class="badge" [ngClass]="statusClass(s.status)">{{ s.status }}</span></td>
            <td>
              <button class="btn btn-sm btn-success me-1" *ngIf="s.status === 'pending'" (click)="approve(s)">Approve</button>
              <button class="btn btn-sm btn-danger me-1" *ngIf="s.status === 'pending'" (click)="reject(s)">Reject</button>
              <button class="btn btn-sm btn-outline-danger" *ngIf="s.status === 'approved'" (click)="deactivate(s)">Deactivate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminStoresComponent implements OnInit {
  stores: any[] = [];
  filter = 'pending';

  constructor(private storeSvc: StoreService) {}

  ngOnInit() { this.load(); }

  load() {
    this.storeSvc.getAllStores({ status: this.filter || undefined }).subscribe(res => this.stores = res.data);
  }

  approve(s: any) {
    this.storeSvc.approveStore(s._id).subscribe(() => { s.status = 'approved'; alert('Store approved!'); });
  }

  reject(s: any) {
    const reason = prompt('Rejection reason:');
    if (reason === null) return;
    this.storeSvc.rejectStore(s._id, reason).subscribe(() => { s.status = 'rejected'; alert('Store rejected.'); });
  }

  deactivate(s: any) {
    if (!confirm('Deactivate this store?')) return;
    this.storeSvc.deactivateStore(s._id).subscribe(() => s.status = 'deactivated');
  }

  statusClass(s: string) {
    const map: any = { pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger', deactivated: 'bg-secondary' };
    return map[s] || 'bg-secondary';
  }
}