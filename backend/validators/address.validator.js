const { body } = require('express-validator');

exports.addressValidator = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('province').notEmpty().withMessage('Province is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('barangay').notEmpty().withMessage('Barangay is required'),
  body('completeAddress').notEmpty().withMessage('Complete address is required'),
  body('label').optional().isIn(['home', 'work', 'other']),
];
