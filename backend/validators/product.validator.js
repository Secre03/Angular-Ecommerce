const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('sku').optional().trim().notEmpty(),
];

exports.updateProductValidator = [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 }),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
];
