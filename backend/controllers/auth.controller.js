const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const { sendTokenResponse } = require("../utils/generateToken");
const sendResponse = require("../utils/sendResponse");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const allowedRoles = ["buyer", "seller"];
    const userRole = allowedRoles.includes(role) ? role : "buyer";

    const existing = await User.findOne({ email }).select("+password");
    if (existing) return next(new ErrorResponse("Email already in use.", 400));

    const user = await User.create({ name, email, password, role: userRole });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse("Invalid email or password.", 401));
    }
    if (!user.isActive)
      return next(new ErrorResponse("Your account has been deactivated.", 403));
    sendTokenResponse(user, 200, res, rememberMe);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  sendResponse(res, 200, "Logged out successfully.");
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendResponse(res, 200, "Profile fetched.", user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true },
    );
    sendResponse(res, 200, "Profile updated.", user);
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile photo
// @route   PUT /api/v1/auth/upload-photo
// @access  Private
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next(new ErrorResponse("Please upload a file.", 400));
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo: req.file.filename },
      { new: true },
    );
    sendResponse(res, 200, "Photo uploaded.", { photo: user.photo });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse("Current password is incorrect.", 401));
    }
    user.password = newPassword;
    await user.save();
    sendResponse(res, 200, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(new ErrorResponse("No account found with that email.", 404));
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in ${process.env.RESET_PASSWORD_EXPIRE} minutes.</p>`,
    });

    sendResponse(res, 200, "Password reset email sent.");
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return next(new ErrorResponse("Invalid or expired reset token.", 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own account (soft delete)
// @route   DELETE /api/v1/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isDeleted: true,
      isActive: false,
      deletedAt: Date.now(),
    });
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    sendResponse(res, 200, "Account deleted successfully.");
  } catch (err) {
    next(err);
  }
};
