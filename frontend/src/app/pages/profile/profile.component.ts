import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AddressService } from '../../core/services/address.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">My Profile</h4>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card p-3">
            <h6>Profile Info</h6>
            <div class="alert alert-success" *ngIf="profileMsg">{{ profileMsg }}</div>
            <div class="mb-2"><label class="form-label">Name</label><input class="form-control" [(ngModel)]="profileForm.name"></div>
            <div class="mb-2"><label class="form-label">Phone</label><input class="form-control" [(ngModel)]="profileForm.phone"></div>
            <button class="btn btn-primary" (click)="updateProfile()">Save Changes</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-3">
            <h6>Change Password</h6>
            <div class="alert alert-success" *ngIf="pwMsg">{{ pwMsg }}</div>
            <div class="alert alert-danger" *ngIf="pwError">{{ pwError }}</div>
            <div class="mb-2"><label class="form-label">Current Password</label><input type="password" class="form-control" [(ngModel)]="pwForm.currentPassword"></div>
            <div class="mb-2"><label class="form-label">New Password</label><input type="password" class="form-control" [(ngModel)]="pwForm.newPassword"></div>
            <button class="btn btn-warning" (click)="changePassword()">Change Password</button>
          </div>
        </div>
        <div class="col-12">
          <div class="card p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">My Addresses</h6>
              <button class="btn btn-sm btn-success" (click)="showAddForm = !showAddForm">+ Add Address</button>
            </div>
            <div class="card p-3 mb-3" *ngIf="showAddForm">
              <div class="row g-2">
                <div class="col-6"><input class="form-control" placeholder="Full Name" [(ngModel)]="addrForm.fullName"></div>
                <div class="col-6"><input class="form-control" placeholder="Phone" [(ngModel)]="addrForm.phone"></div>
                <div class="col-6"><input class="form-control" placeholder="Province" [(ngModel)]="addrForm.province"></div>
                <div class="col-6"><input class="form-control" placeholder="City" [(ngModel)]="addrForm.city"></div>
                <div class="col-6"><input class="form-control" placeholder="Barangay" [(ngModel)]="addrForm.barangay"></div>
                <div class="col-6"><input class="form-control" placeholder="Zip Code" [(ngModel)]="addrForm.zipCode"></div>
                <div class="col-12"><input class="form-control" placeholder="Complete Address" [(ngModel)]="addrForm.completeAddress"></div>
                <div class="col-12 form-check ms-1">
                  <input type="checkbox" class="form-check-input" [(ngModel)]="addrForm.isDefault" id="defChk">
                  <label class="form-check-label" for="defChk">Set as default</label>
                </div>
              </div>
              <button class="btn btn-primary mt-2" (click)="addAddress()">Save Address</button>
            </div>
            <div *ngFor="let a of addresses" class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ a.fullName }}</strong> — {{ a.phone }}<br>
                <small>{{ a.completeAddress }}, {{ a.barangay }}, {{ a.city }}, {{ a.province }}</small>
                <span class="badge bg-success ms-2" *ngIf="a.isDefault">Default</span>
              </div>
              <div class="d-flex gap-1">
                <button class="btn btn-sm btn-outline-secondary" *ngIf="!a.isDefault" (click)="setDefault(a._id)">Set Default</button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteAddress(a._id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: any = { name: '', phone: '' };
  pwForm = { currentPassword: '', newPassword: '' };
  addrForm: any = { fullName: '', phone: '', province: '', city: '', barangay: '', completeAddress: '', zipCode: '', isDefault: false };
  addresses: any[] = [];
  profileMsg = ''; pwMsg = ''; pwError = '';
  showAddForm = false;

  constructor(public auth: AuthService, private addrSvc: AddressService) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    this.profileForm = { name: u?.name || '', phone: '' };
    this.loadAddresses();
  }

  updateProfile() {
    this.auth.updateProfile(this.profileForm).subscribe({
      next: () => { this.profileMsg = 'Profile updated!'; setTimeout(() => this.profileMsg = '', 2000); },
      error: (err) => alert(err.error?.message)
    });
  }

  changePassword() {
    this.pwMsg = ''; this.pwError = '';
    this.auth.changePassword(this.pwForm).subscribe({
      next: () => { this.pwMsg = 'Password changed!'; this.pwForm = { currentPassword: '', newPassword: '' }; },
      error: (err) => this.pwError = err.error?.message || 'Failed.'
    });
  }

  loadAddresses() { this.addrSvc.getAddresses().subscribe(res => this.addresses = res.data); }

  addAddress() {
    this.addrSvc.addAddress(this.addrForm).subscribe({
      next: () => {
        this.loadAddresses(); this.showAddForm = false;
        this.addrForm = { fullName: '', phone: '', province: '', city: '', barangay: '', completeAddress: '', zipCode: '', isDefault: false };
      },
      error: (err) => alert(err.error?.message)
    });
  }

  setDefault(id: string) { this.addrSvc.setDefault(id).subscribe(() => this.loadAddresses()); }
  deleteAddress(id: string) {
    if (confirm('Delete this address?')) this.addrSvc.deleteAddress(id).subscribe(() => this.loadAddresses());
  }
}