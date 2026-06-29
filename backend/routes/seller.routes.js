const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/seller.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('seller'));
router.get('/dashboard', getDashboard);

module.exports = router;
