const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUser,
  deactivateUser,
  activateUser,
  getPendingStores,
  getAllStores,
  getPendingProducts,
  getAllProducts,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id/deactivate", deactivateUser);
router.put("/users/:id/activate", activateUser);
router.get("/stores", getAllStores);
router.get("/stores/pending", getPendingStores);
router.get("/products", getAllProducts);
router.get("/products/pending", getPendingProducts);

module.exports = router;
