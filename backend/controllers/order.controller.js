const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const paginate = require("../utils/pagination");

exports.placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = "cod" } = req.body;
    const cart = await Cart.findOne({ buyer: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0)
      return next(new ErrorResponse("Your cart is empty.", 400));

    // Group items by seller
    const sellerMap = {};
    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.status !== "approved")
        return next(
          new ErrorResponse(
            `Product "${product?.name}" is no longer available.`,
            400,
          ),
        );
      if (product.quantity < item.quantity)
        return next(
          new ErrorResponse(`Insufficient stock for "${product.name}".`, 400),
        );
      const sellerId = product.seller.toString();
      if (!sellerMap[sellerId])
        sellerMap[sellerId] = {
          seller: product.seller,
          store: product.store,
          items: [],
        };
      sellerMap[sellerId].items.push(item);
    }

    const orders = [];
    for (const sellerId of Object.keys(sellerMap)) {
      const group = sellerMap[sellerId];
      const orderItems = group.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0] || null,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));
      const subtotal = orderItems.reduce((acc, i) => acc + i.subtotal, 0);
      const order = await Order.create({
        buyer: req.user._id,
        seller: group.seller,
        store: group.store,
        items: orderItems,
        shippingAddress,
        subtotal,
        total: subtotal,
        paymentMethod,
        statusHistory: [{ status: "pending", changedBy: req.user._id }],
      });

      // Deduct stock
      for (const item of group.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { quantity: -item.quantity },
        });
      }

      await Notification.create({
        recipient: group.seller,
        title: "New Order",
        message: `You have a new order #${order.orderNumber}.`,
        type: "order_placed",
      });
      await Notification.create({
        recipient: req.user._id,
        title: "Order Placed",
        message: `Your order #${order.orderNumber} has been placed.`,
        type: "order_placed",
      });
      orders.push(order);
    }

    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();
    sendResponse(res, 201, "Order placed successfully.", orders);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { buyer: req.user._id };
    if (status) query.status = status;
    const result = await paginate(Order, query, page, limit, [
      { path: "store", select: "name logo" },
      { path: "items.product", select: "name images" },
    ]);
    sendResponse(res, 200, "Orders fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    }).populate("store seller");
    if (!order) return next(new ErrorResponse("Order not found.", 404));
    sendResponse(res, 200, "Order fetched.", order);
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    });
    if (!order) return next(new ErrorResponse("Order not found.", 404));
    if (!["pending", "approved"].includes(order.status))
      return next(
        new ErrorResponse("Order cannot be cancelled at this stage.", 400),
      );
    order.status = "cancelled";
    order.cancelReason = req.body.reason || "Cancelled by buyer.";
    order.statusHistory.push({
      status: "cancelled",
      changedBy: req.user._id,
      note: order.cancelReason,
    });
    await order.save();
    await Notification.create({
      recipient: order.seller,
      title: "Order Cancelled",
      message: `Order #${order.orderNumber} was cancelled by the buyer.`,
      type: "order_cancelled",
    });
    sendResponse(res, 200, "Order cancelled.", order);
  } catch (err) {
    next(err);
  }
};

// Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { seller: req.user._id };
    if (status) query.status = status;
    const result = await paginate(Order, query, page, limit, {
      path: "buyer",
      select: "name email",
    });
    sendResponse(res, 200, "Orders fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!order) return next(new ErrorResponse("Order not found.", 404));
    order.status = status;
    order.statusHistory.push({ status, changedBy: req.user._id, note });
    await order.save();
    const notifTypes = {
      shipped: "order_shipped",
      delivered: "order_delivered",
      completed: "order_completed",
      cancelled: "order_cancelled",
    };
    if (notifTypes[status]) {
      await Notification.create({
        recipient: order.buyer,
        title: `Order ${status}`,
        message: `Your order #${order.orderNumber} is now ${status}.`,
        type: notifTypes[status],
      });
    }
    sendResponse(res, 200, "Order status updated.", order);
  } catch (err) {
    next(err);
  }
};

// Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const result = await paginate(Order, query, page, limit, [
      { path: "buyer", select: "name email" },
      { path: "seller", select: "name" },
      { path: "store", select: "name" },
    ]);
    sendResponse(res, 200, "All orders fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};
