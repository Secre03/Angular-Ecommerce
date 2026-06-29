import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">🛒 O-Shopping</a>
        <button class="navbar-toggler" type="button" (click)="menuOpen = !menuOpen">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" [class.collapse]="!menuOpen">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" routerLink="/products" routerLinkActive="active" (click)="menuOpen=false">Products</a></li>

            <ng-container *ngIf="auth.isBuyer">
              <li class="nav-item">
                <a class="nav-link" routerLink="/cart" routerLinkActive="active" (click)="menuOpen=false">
                  Cart <span class="badge bg-danger badge-cart" *ngIf="cartSvc.cartCount() > 0">{{ cartSvc.cartCount() }}</span>
                </a>
              </li>
              <li class="nav-item"><a class="nav-link" routerLink="/orders" routerLinkActive="active" (click)="menuOpen=false">My Orders</a></li>
            </ng-container>

            <ng-container *ngIf="auth.isSeller">
              <li class="nav-item"><a class="nav-link" routerLink="/seller/dashboard" routerLinkActive="active" (click)="menuOpen=false">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/seller/store" routerLinkActive="active" (click)="menuOpen=false">My Store</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/seller/products" routerLinkActive="active" (click)="menuOpen=false">Products</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/seller/orders" routerLinkActive="active" (click)="menuOpen=false">Orders</a></li>
            </ng-container>

            <ng-container *ngIf="auth.isAdmin">
              <li class="nav-item"><a class="nav-link" routerLink="/admin/dashboard" routerLinkActive="active" (click)="menuOpen=false">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/admin/users" routerLinkActive="active" (click)="menuOpen=false">Users</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/admin/stores" routerLinkActive="active" (click)="menuOpen=false">Stores</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/admin/products" routerLinkActive="active" (click)="menuOpen=false">Products</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/admin/categories" routerLinkActive="active" (click)="menuOpen=false">Categories</a></li>
            </ng-container>
          </ul>

          <ul class="navbar-nav ms-auto">
            <ng-container *ngIf="auth.isLoggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/notifications" (click)="menuOpen=false">
                  <span class="badge bg-danger badge-cart" *ngIf="notifSvc.unreadCount() > 0">{{ notifSvc.unreadCount() }}</span>
                </a>
              </li>
              <li class="nav-item"><a class="nav-link" routerLink="/profile" (click)="menuOpen=false">👤 {{ auth.currentUser()?.name }}</a></li>
              <li class="nav-item"><a class="nav-link text-warning pointer" (click)="logout()" style="cursor:pointer">Logout</a></li>
            </ng-container>
            <ng-container *ngIf="!auth.isLoggedIn">
              <li class="nav-item"><a class="nav-link" routerLink="/login" (click)="menuOpen=false">Login</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/register" (click)="menuOpen=false">Register</a></li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  menuOpen = false;

  constructor(public auth: AuthService, public cartSvc: CartService, public notifSvc: NotificationService) {}

  ngOnInit() {
    if (this.auth.isBuyer) this.cartSvc.getCart().subscribe();
    if (this.auth.isLoggedIn) this.notifSvc.getNotifications().subscribe();
  }

  logout() {
    this.auth.logout();
    this.menuOpen = false;
  }
}