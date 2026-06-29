const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  placeOrderValidator,
  updateOrderStatusValidator,
} = require("../validators/order.validator");

// Buyer
router.post(
  "/",
  protect,
  authorize("buyer"),
  placeOrderValidator,
  validate,
  placeOrder,
);
router.get("/my", protect, authorize("buyer"), getMyOrders);
router.get("/my/:id", protect, authorize("buyer"), getMyOrder);
router.put("/my/:id/cancel", protect, authorize("buyer"), cancelOrder);

// Seller
router.get("/seller", protect, authorize("seller"), getSellerOrders);
router.put(
  "/seller/:id/status",
  protect,
  authorize("seller"),
  updateOrderStatusValidator,
  validate,
  updateOrderStatus,
);

// Admin
router.get("/admin/all", protect, authorize("admin"), getAllOrders);

module.exports = router;
