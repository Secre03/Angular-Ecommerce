const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  uploadPhoto,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require("../validators/auth.validator");
const { uploadProfile } = require("../config/multer");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put(
  "/update-profile",
  protect,
  updateProfileValidator,
  validate,
  updateProfile,
);
router.put(
  "/upload-photo",
  protect,
  uploadProfile.single("photo"),
  uploadPhoto,
);
router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  validate,
  changePassword,
);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword,
);
router.put(
  "/reset-password/:resettoken",
  resetPasswordValidator,
  validate,
  resetPassword,
);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
