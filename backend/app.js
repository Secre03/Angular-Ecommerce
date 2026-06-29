const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/error');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend.com' : 'http://localhost:4200',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests. Please try again later.' } });
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/stores', require('./routes/store.routes'));
app.use('/api/v1/categories', require('./routes/category.routes'));
app.use('/api/v1/products', require('./routes/product.routes'));
app.use('/api/v1/cart', require('./routes/cart.routes'));
app.use('/api/v1/orders', require('./routes/order.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/addresses', require('./routes/address.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/seller', require('./routes/seller.routes'));

// Health check
app.get('/api/v1/health', (req, res) => res.json({ success: true, message: 'API is running.', env: process.env.NODE_ENV }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` }));

// Error handler
app.use(errorHandler);

module.exports = app;
