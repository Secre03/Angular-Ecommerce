const express = require("express");
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { addressValidator } = require("../validators/address.validator");

router.use(protect);
router.get("/", getAddresses);
router.post("/", addressValidator, validate, addAddress);
router.put("/:id", addressValidator, validate, updateAddress);
router.delete("/:id", deleteAddress);
router.put("/:id/default", setDefaultAddress);

module.exports = router;
