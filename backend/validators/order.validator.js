const { body } = require('express-validator');

exports.placeOrderValidator = [
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.province').notEmpty().withMessage('Province is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.barangay').notEmpty().withMessage('Barangay is required'),
  body('shippingAddress.completeAddress').notEmpty().withMessage('Complete address is required'),
];

exports.updateOrderStatusValidator = [
  body('status')
    .notEmpty()
    .isIn(['approved','processing','packed','shipped','delivered','completed','cancelled','returned','refund_requested','refunded'])
    .withMessage('Invalid order status'),
];
