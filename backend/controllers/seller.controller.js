const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");

exports.getDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    const [
      totalProducts,
      pendingProducts,
      approvedProducts,
      totalOrders,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Product.countDocuments({ seller: sellerId, status: "pending" }),
      Product.countDocuments({ seller: sellerId, status: "approved" }),
      Order.countDocuments({ seller: sellerId }),
      Order.aggregate([
        { $match: { seller: sellerId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find({ seller: sellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("buyer", "name email"),
    ]);

    // Unique buyers
    const uniqueBuyers = await Order.distinct("buyer", { seller: sellerId });

    sendResponse(res, 200, "Seller dashboard fetched.", {
      products: {
        total: totalProducts,
        pending: pendingProducts,
        approved: approvedProducts,
      },
      orders: { total: totalOrders },
      revenue: revenueResult[0]?.total || 0,
      customers: uniqueBuyers.length,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};
