# E-Commerce Backend API

A production-ready RESTful API built with **Node.js**, **Express.js**, and **MongoDB**.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT (access tokens + cookies)
- **Security:** Helmet, CORS, Rate Limiting, bcrypt
- **Uploads:** Multer (local storage, ready for Cloudinary/S3)
- **Validation:** Express Validator

## Roles

| Role | Description |
|------|-------------|
| `admin` | Manages users, stores, products |
| `seller` | Owns a store, manages products and orders |
| `buyer` | Browses, adds to cart, places orders |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Seed the database
```bash
npm run seed
```

This creates:
- **Admin:** admin@ecommerce.com / Admin@1234
- **Seller:** seller@ecommerce.com / Seller@1234
- **Buyer:** buyer@ecommerce.com / Buyer@1234
- 8 default categories
- 1 approved sample store with 2 products

### 4. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

API will be available at: `http://localhost:5000/api/v1`

## Folder Structure

```
backend/
├── config/
│   ├── db.js               # MongoDB connection
│   └── multer.js           # File upload config
├── controllers/
│   ├── auth.controller.js
│   ├── store.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   ├── notification.controller.js
│   ├── address.controller.js
│   ├── admin.controller.js
│   └── seller.controller.js
├── middleware/
│   ├── auth.js             # JWT protect & RBAC
│   ├── error.js            # Centralized error handler
│   └── validate.js         # Express validator middleware
├── models/
│   ├── User.js
│   ├── Store.js
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Address.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── store.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── notification.routes.js
│   ├── address.routes.js
│   ├── admin.routes.js
│   └── seller.routes.js
├── validators/
│   ├── auth.validator.js
│   ├── store.validator.js
│   ├── product.validator.js
│   ├── order.validator.js
│   └── address.validator.js
├── utils/
│   ├── errorResponse.js
│   ├── sendResponse.js
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── pagination.js
├── uploads/
│   ├── profiles/
│   ├── stores/
│   └── products/
├── database/
│   └── indexes.js
├── seed/
│   └── seeder.js
├── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md
└── package.json
```

## API Base Routes

| Module | Base Route |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Stores | `/api/v1/stores` |
| Categories | `/api/v1/categories` |
| Products | `/api/v1/products` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Notifications | `/api/v1/notifications` |
| Addresses | `/api/v1/addresses` |
| Admin | `/api/v1/admin` |
| Seller | `/api/v1/seller` |

See `API_DOCUMENTATION.md` for full endpoint reference.

## Angular Integration (Frontend)

This API is ready to connect with an Angular frontend. Key notes:
- CORS is pre-configured for `http://localhost:4200`
- All responses follow a consistent JSON format
- JWT is returned in both response body and HTTP-only cookie
- File URLs follow: `http://localhost:5000/uploads/<folder>/<filename>`

## Security Features

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT authentication with configurable expiry
- Remember Me support (30-day tokens)
- HTTP-only cookies
- Helmet headers
- Rate limiting (200 req / 15 min)
- Input validation on all endpoints
- Role-based access control
- Soft delete for users and stores

## Future Improvements

- [ ] Email sending via Nodemailer
- [ ] Cloudinary / AWS S3 for file storage
- [ ] WebSocket notifications (Socket.io)
- [ ] Payment gateway (PayMongo / Stripe)
- [ ] Product reviews and ratings
- [ ] Vouchers / coupons
- [ ] Analytics dashboard
