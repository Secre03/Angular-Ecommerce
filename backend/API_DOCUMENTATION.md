# E-Commerce Backend API Documentation

**Base URL:** `http://localhost:5000/api/v1`  
**Auth:** Bearer Token (JWT) via `Authorization: Bearer <token>` header or `token` cookie  
**Content-Type:** `application/json` (use `multipart/form-data` for file uploads)

---

## Response Format

### Success
```json
{ "success": true, "message": "...", "data": {}, "meta": {} }
```

### Error
```json
{ "success": false, "message": "Error description" }
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [{ "field": "email", "message": "Valid email is required" }]
}
```

---

## Health Check

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Check if API is running |

---

## Authentication (`/auth`)

### Register
- **POST** `/auth/register`
- **Access:** Public
```json
// Request Body
{ "name": "John Doe", "email": "john@email.com", "password": "Password1", "role": "buyer" }
// role: "buyer" | "seller" (default: buyer)

// Response 201
{ "success": true, "token": "jwt_token", "data": { "_id": "...", "name": "John Doe", "email": "...", "role": "buyer" } }
```

### Login
- **POST** `/auth/login`
- **Access:** Public
```json
// Request Body
{ "email": "john@email.com", "password": "Password1", "rememberMe": false }

// Response 200
{ "success": true, "token": "jwt_token", "data": { "_id": "...", "name": "...", "role": "..." } }
```

### Logout
- **POST** `/auth/logout`
- **Access:** Private (any role)
```json
// Response 200
{ "success": true, "message": "Logged out successfully." }
```

### Get Current User
- **GET** `/auth/me`
- **Access:** Private (any role)
```json
// Response 200
{ "success": true, "message": "Profile fetched.", "data": { "_id": "...", "name": "...", "email": "...", "role": "..." } }
```

### Update Profile
- **PUT** `/auth/update-profile`
- **Access:** Private (any role)
```json
// Request Body
{ "name": "New Name", "phone": "09123456789" }
```

### Upload Profile Photo
- **PUT** `/auth/upload-photo`
- **Access:** Private (any role)
- **Content-Type:** `multipart/form-data`
- **Field:** `photo` (image file — jpeg, jpg, png, webp; max 5MB)

### Change Password
- **PUT** `/auth/change-password`
- **Access:** Private (any role)
```json
{ "currentPassword": "OldPass1", "newPassword": "NewPass1" }
```

### Forgot Password
- **POST** `/auth/forgot-password`
- **Access:** Public
```json
{ "email": "john@email.com" }
```

### Reset Password
- **PUT** `/auth/reset-password/:resettoken`
- **Access:** Public
```json
{ "password": "NewPass1" }
```

### Delete Account (Soft Delete)
- **DELETE** `/auth/delete-account`
- **Access:** Private (any role)

---

## Stores (`/stores`)

### Get All Approved Stores
- **GET** `/stores`
- **Access:** Public
- **Query:** `?page=1&limit=10&search=name`

### Get Store by ID
- **GET** `/stores/:id`
- **Access:** Public

### Create Store
- **POST** `/stores`
- **Access:** Private (seller only)
```json
{
  "name": "My Store",
  "description": "Store description",
  "contactNumber": "09123456789",
  "email": "store@email.com",
  "location": {
    "province": "Albay",
    "city": "Legazpi City",
    "barangay": "Sagpon",
    "completeAddress": "123 Main St, Sagpon",
    "latitude": 13.1391,
    "longitude": 123.7438
  }
}
```

### Get My Store
- **GET** `/stores/my/store`
- **Access:** Private (seller)

### Update My Store
- **PUT** `/stores/my/store`
- **Access:** Private (seller)

### Upload Store Logo
- **PUT** `/stores/my/store/logo`
- **Access:** Private (seller)
- **Content-Type:** `multipart/form-data`
- **Field:** `logo`

### Upload Store Banner
- **PUT** `/stores/my/store/banner`
- **Access:** Private (seller)
- **Content-Type:** `multipart/form-data`
- **Field:** `banner`

### Delete My Store
- **DELETE** `/stores/my/store`
- **Access:** Private (seller)

### Approve Store (Admin)
- **PUT** `/stores/:id/approve`
- **Access:** Private (admin)

### Reject Store (Admin)
- **PUT** `/stores/:id/reject`
- **Access:** Private (admin)
```json
{ "reason": "Incomplete business information." }
```

### Deactivate Store (Admin)
- **PUT** `/stores/:id/deactivate`
- **Access:** Private (admin)

---

## Categories (`/categories`)

### Get All Categories
- **GET** `/categories`
- **Access:** Public

### Get Category by ID
- **GET** `/categories/:id`
- **Access:** Public

### Create Category (Admin)
- **POST** `/categories`
- **Access:** Private (admin)
```json
{ "name": "Electronics", "description": "Gadgets and devices", "icon": "laptop" }
```

### Update Category (Admin)
- **PUT** `/categories/:id`
- **Access:** Private (admin)

### Delete Category (Admin)
- **DELETE** `/categories/:id`
- **Access:** Private (admin)

---

## Products (`/products`)

### Get All Approved Products (Public)
- **GET** `/products`
- **Access:** Public
- **Query:** `?page=1&limit=10&search=name&category=id&minPrice=100&maxPrice=5000&storeId=id`

### Get Product by ID (Public)
- **GET** `/products/:id`
- **Access:** Public

### Create Product (Seller)
- **POST** `/products`
- **Access:** Private (seller — store must be approved)
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 999,
  "discount": 10,
  "quantity": 50,
  "category": "category_id",
  "sku": "SKU-001",
  "variants": [{ "name": "Color", "options": ["Red", "Blue"] }]
}
```

### Upload Product Images (Seller)
- **POST** `/products/my/products/:id/images`
- **Access:** Private (seller)
- **Content-Type:** `multipart/form-data`
- **Field:** `images` (up to 5 images)

### Get My Products (Seller)
- **GET** `/products/my/products`
- **Access:** Private (seller)
- **Query:** `?page=1&limit=10&status=pending`

### Get My Product by ID (Seller)
- **GET** `/products/my/products/:id`
- **Access:** Private (seller)

### Update My Product (Seller)
- **PUT** `/products/my/products/:id`
- **Access:** Private (seller)

### Delete My Product (Seller)
- **DELETE** `/products/my/products/:id`
- **Access:** Private (seller)

### Approve Product (Admin)
- **PUT** `/products/:id/approve`
- **Access:** Private (admin)

### Reject Product (Admin)
- **PUT** `/products/:id/reject`
- **Access:** Private (admin)
```json
{ "reason": "Product images are low quality." }
```

---

## Cart (`/cart`)

> All cart routes require Buyer role.

### Get Cart
- **GET** `/cart`
- **Access:** Private (buyer)

### Add to Cart
- **POST** `/cart/add`
- **Access:** Private (buyer)
```json
{ "productId": "product_id", "quantity": 2 }
```

### Update Cart Item
- **PUT** `/cart/item/:itemId`
- **Access:** Private (buyer)
```json
{ "quantity": 3 }
```

### Remove Cart Item
- **DELETE** `/cart/item/:itemId`
- **Access:** Private (buyer)

### Clear Cart
- **DELETE** `/cart/clear`
- **Access:** Private (buyer)

---

## Orders (`/orders`)

### Place Order (Buyer)
- **POST** `/orders`
- **Access:** Private (buyer)
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "09123456789",
    "province": "Albay",
    "city": "Legazpi City",
    "barangay": "Sagpon",
    "completeAddress": "123 Main St",
    "zipCode": "4500",
    "notes": "Leave at the gate"
  },
  "paymentMethod": "cod"
}
```

### Get My Orders (Buyer)
- **GET** `/orders/my`
- **Access:** Private (buyer)
- **Query:** `?page=1&limit=10&status=pending`

### Get My Order by ID (Buyer)
- **GET** `/orders/my/:id`
- **Access:** Private (buyer)

### Cancel Order (Buyer)
- **PUT** `/orders/my/:id/cancel`
- **Access:** Private (buyer)
```json
{ "reason": "Changed my mind." }
```

### Get Seller Orders
- **GET** `/orders/seller`
- **Access:** Private (seller)
- **Query:** `?page=1&limit=10&status=pending`

### Update Order Status (Seller)
- **PUT** `/orders/seller/:id/status`
- **Access:** Private (seller)
```json
{ "status": "shipped", "note": "Shipped via LBC." }
// Allowed status: approved | processing | packed | shipped | delivered | completed | cancelled | returned | refund_requested | refunded
```

### Get All Orders (Admin)
- **GET** `/orders/admin/all`
- **Access:** Private (admin)
- **Query:** `?page=1&limit=10&status=pending`

---

## Notifications (`/notifications`)

### Get Notifications
- **GET** `/notifications`
- **Access:** Private (any role)
- **Query:** `?page=1&limit=20`
```json
// Response
{
  "success": true,
  "data": [...],
  "meta": { "total": 25, "unread": 5, "page": 1, "limit": 20 }
}
```

### Mark Notification as Read
- **PUT** `/notifications/:id/read`
- **Access:** Private (any role)

### Mark All as Read
- **PUT** `/notifications/read-all`
- **Access:** Private (any role)

### Delete Notification
- **DELETE** `/notifications/:id`
- **Access:** Private (any role)

---

## Addresses (`/addresses`)

### Get My Addresses
- **GET** `/addresses`
- **Access:** Private (any role)

### Add Address
- **POST** `/addresses`
- **Access:** Private (any role)
```json
{
  "fullName": "John Doe",
  "phone": "09123456789",
  "province": "Albay",
  "city": "Legazpi City",
  "barangay": "Sagpon",
  "completeAddress": "123 Main St",
  "zipCode": "4500",
  "label": "home",
  "isDefault": true
}
```

### Update Address
- **PUT** `/addresses/:id`
- **Access:** Private (any role)

### Delete Address
- **DELETE** `/addresses/:id`
- **Access:** Private (any role)

### Set Default Address
- **PUT** `/addresses/:id/default`
- **Access:** Private (any role)

---

## Admin Dashboard (`/admin`)

> All admin routes require Admin role.

### Dashboard Statistics
- **GET** `/admin/dashboard`
```json
// Response
{
  "data": {
    "users": { "total": 100, "buyers": 80, "sellers": 20 },
    "stores": { "pending": 5, "approved": 15, "deactivated": 2 },
    "products": { "pending": 10, "approved": 200, "rejected": 3 },
    "orders": { "total": 450 },
    "revenue": 125000
  }
}
```

### Get All Users
- **GET** `/admin/users`
- **Query:** `?page=1&limit=10&role=buyer&search=name`

### Get User by ID
- **GET** `/admin/users/:id`

### Deactivate User
- **PUT** `/admin/users/:id/deactivate`

### Activate User
- **PUT** `/admin/users/:id/activate`

### Get All Stores
- **GET** `/admin/stores`
- **Query:** `?page=1&limit=10&status=pending`

### Get Pending Stores
- **GET** `/admin/stores/pending`

### Get All Products
- **GET** `/admin/products`
- **Query:** `?page=1&limit=10&status=pending`

### Get Pending Products
- **GET** `/admin/products/pending`

---

## Seller Dashboard (`/seller`)

### Seller Dashboard Stats
- **GET** `/seller/dashboard`
- **Access:** Private (seller)
```json
// Response
{
  "data": {
    "products": { "total": 20, "pending": 3, "approved": 17 },
    "orders": { "total": 85 },
    "revenue": 45000,
    "customers": 32,
    "recentOrders": [...]
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Order Status Flow

```
pending → approved → processing → packed → shipped → delivered → completed
       ↘ cancelled
                                                    ↘ returned → refund_requested → refunded
```

---

## Store Status Flow

```
pending → approved → deactivated
        ↘ rejected
```

---

## Product Status Flow

```
pending → approved (visible to buyers)
        ↘ rejected
approved → hidden (seller can hide)
approved → out_of_stock (automatic when quantity = 0)
```

---

## File Upload Notes

- Max file size: **5MB**
- Allowed types: `jpeg`, `jpg`, `png`, `webp`
- Files served at: `http://localhost:5000/uploads/<folder>/<filename>`
- Folders: `profiles/`, `stores/`, `products/`
- Ready for migration to Cloudinary or AWS S3

---

## Rate Limiting

- **200 requests** per 15 minutes per IP
- Applied to all `/api/*` routes
