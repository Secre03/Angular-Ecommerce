const User = require("../models/User");
const Store = require("../models/Store");
const Product = require("../models/Product");
const Order = require("../models/Order");
const sendResponse = require("../utils/sendResponse");
const paginate = require("../utils/pagination");
const ErrorResponse = require("../utils/errorResponse");

// Dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      pendingStores,
      approvedStores,
      deactivatedStores,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      totalOrders,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      Store.countDocuments({ status: "pending" }),
      Store.countDocuments({ status: "approved" }),
      Store.countDocuments({ status: "deactivated" }),
      Product.countDocuments({ status: "pending" }),
      Product.countDocuments({ status: "approved" }),
      Product.countDocuments({ status: "rejected" }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);

    sendResponse(res, 200, "Dashboard stats fetched.", {
      users: { total: totalUsers, buyers: totalBuyers, sellers: totalSellers },
      stores: {
        pending: pendingStores,
        approved: approvedStores,
        deactivated: deactivatedStores,
      },
      products: {
        pending: pendingProducts,
        approved: approvedProducts,
        rejected: rejectedProducts,
      },
      orders: { total: totalOrders },
      revenue: revenueResult[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

// User management
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    const result = await paginate(User, query, page, limit);
    sendResponse(res, 200, "Users fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse("User not found.", 404));
    sendResponse(res, 200, "User fetched.", user);
  } catch (err) {
    next(err);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user) return next(new ErrorResponse("User not found.", 404));
    sendResponse(res, 200, "User deactivated.", user);
  } catch (err) {
    next(err);
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true },
    );
    if (!user) return next(new ErrorResponse("User not found.", 404));
    sendResponse(res, 200, "User activated.", user);
  } catch (err) {
    next(err);
  }
};

// Store management
exports.getPendingStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Store, { status: "pending" }, page, limit, {
      path: "owner",
      select: "name email",
    });
    sendResponse(res, 200, "Pending stores fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getAllStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const result = await paginate(Store, query, page, limit, {
      path: "owner",
      select: "name email",
    });
    sendResponse(res, 200, "Stores fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

// Product management
exports.getPendingProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Product, { status: "pending" }, page, limit, [
      { path: "seller", select: "name" },
      { path: "store", select: "name" },
      { path: "category", select: "name" },
    ]);
    sendResponse(
      res,
      200,
      "Pending products fetched.",
      result.data,
      result.meta,
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const result = await paginate(Product, query, page, limit, [
      { path: "seller", select: "name" },
      { path: "store", select: "name" },
    ]);
    sendResponse(res, 200, "Products fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};
