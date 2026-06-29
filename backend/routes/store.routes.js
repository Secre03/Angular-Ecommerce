const express = require("express");
const router = express.Router();
const {
  createStore,
  getMyStore,
  updateStore,
  uploadStoreLogo,
  uploadStoreBanner,
  deleteStore,
  getStores,
  getStore,
  approveStore,
  rejectStore,
  deactivateStore,
} = require("../controllers/store.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createStoreValidator,
  updateStoreValidator,
} = require("../validators/store.validator");
const { uploadStore } = require("../config/multer");

// Public
router.get("/", getStores);
router.get("/:id", getStore);

// Seller
router.post(
  "/",
  protect,
  authorize("seller"),
  createStoreValidator,
  validate,
  createStore,
);
router.get("/my/store", protect, authorize("seller"), getMyStore);
router.put(
  "/my/store",
  protect,
  authorize("seller"),
  updateStoreValidator,
  validate,
  updateStore,
);
router.put(
  "/my/store/logo",
  protect,
  authorize("seller"),
  uploadStore.single("logo"),
  uploadStoreLogo,
);
router.put(
  "/my/store/banner",
  protect,
  authorize("seller"),
  uploadStore.single("banner"),
  uploadStoreBanner,
);
router.delete("/my/store", protect, authorize("seller"), deleteStore);

// Admin
router.put("/:id/approve", protect, authorize("admin"), approveStore);
router.put("/:id/reject", protect, authorize("admin"), rejectStore);
router.put("/:id/deactivate", protect, authorize("admin"), deactivateStore);

module.exports = router;
