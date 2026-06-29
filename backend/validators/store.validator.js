const { body } = require('express-validator');

exports.createStoreValidator = [
  body('name').trim().notEmpty().withMessage('Store name is required'),
  body('location.province').notEmpty().withMessage('Province is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.barangay').notEmpty().withMessage('Barangay is required'),
  body('location.completeAddress').notEmpty().withMessage('Complete address is required'),
  body('contactNumber').optional().isMobilePhone().withMessage('Invalid contact number'),
  body('email').optional().isEmail().withMessage('Invalid store email'),
];

exports.updateStoreValidator = [
  body('name').optional().trim().notEmpty().withMessage('Store name cannot be empty'),
  body('location.province').optional().notEmpty(),
  body('location.city').optional().notEmpty(),
  body('location.barangay').optional().notEmpty(),
  body('contactNumber').optional().isMobilePhone().withMessage('Invalid contact number'),
  body('email').optional().isEmail().withMessage('Invalid store email'),
];
