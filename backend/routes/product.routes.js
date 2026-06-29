const express = require("express");
const router = express.Router();
const {
  createProduct,
  uploadProductImages,
  getMyProducts,
  getMyProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  approveProduct,
  rejectProduct,
} = require("../controllers/product.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");
const { uploadProduct } = require("../config/multer");

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Seller
router.post(
  "/",
  protect,
  authorize("seller"),
  createProductValidator,
  validate,
  createProduct,
);
router.get("/my/products", protect, authorize("seller"), getMyProducts);
router.get("/my/products/:id", protect, authorize("seller"), getMyProduct);
router.put(
  "/my/products/:id",
  protect,
  authorize("seller"),
  updateProductValidator,
  validate,
  updateProduct,
);
router.post(
  "/my/products/:id/images",
  protect,
  authorize("seller"),
  uploadProduct.array("images", 5),
  uploadProductImages,
);
router.delete("/my/products/:id", protect, authorize("seller"), deleteProduct);

// Admin
router.put("/:id/approve", protect, authorize("admin"), approveProduct);
router.put("/:id/reject", protect, authorize("admin"), rejectProduct);

module.exports = router;
