import { Routes } from '@angular/router';
import { authGuard, roleGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },

  { path: 'products', loadComponent: () => import('./pages/products/list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/products/detail/product-detail.component').then(m => m.ProductDetailComponent) },

  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), canActivate: [roleGuard('buyer')] },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [roleGuard('buyer')] },
  { path: 'orders', loadComponent: () => import('./pages/orders/list/order-list.component').then(m => m.OrderListComponent), canActivate: [roleGuard('buyer')] },
  { path: 'orders/:id', loadComponent: () => import('./pages/orders/detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [roleGuard('buyer')] },

  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent), canActivate: [authGuard] },

  { path: 'seller/dashboard', loadComponent: () => import('./pages/seller/dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent), canActivate: [roleGuard('seller')] },
  { path: 'seller/store', loadComponent: () => import('./pages/seller/store/seller-store.component').then(m => m.SellerStoreComponent), canActivate: [roleGuard('seller')] },
  { path: 'seller/products', loadComponent: () => import('./pages/seller/products/list/seller-product-list.component').then(m => m.SellerProductListComponent), canActivate: [roleGuard('seller')] },
  { path: 'seller/products/new', loadComponent: () => import('./pages/seller/products/form/seller-product-form.component').then(m => m.SellerProductFormComponent), canActivate: [roleGuard('seller')] },
  { path: 'seller/products/edit/:id', loadComponent: () => import('./pages/seller/products/form/seller-product-form.component').then(m => m.SellerProductFormComponent), canActivate: [roleGuard('seller')] },
  { path: 'seller/orders', loadComponent: () => import('./pages/seller/orders/seller-orders.component').then(m => m.SellerOrdersComponent), canActivate: [roleGuard('seller')] },

  { path: 'admin/dashboard', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [roleGuard('admin')] },
  { path: 'admin/users', loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent), canActivate: [roleGuard('admin')] },
  { path: 'admin/stores', loadComponent: () => import('./pages/admin/stores/admin-stores.component').then(m => m.AdminStoresComponent), canActivate: [roleGuard('admin')] },
  { path: 'admin/products', loadComponent: () => import('./pages/admin/products/admin-products.component').then(m => m.AdminProductsComponent), canActivate: [roleGuard('admin')] },
  { path: 'admin/categories', loadComponent: () => import('./pages/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent), canActivate: [roleGuard('admin')] },

  { path: '**', redirectTo: '/products' }
];