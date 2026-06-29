const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ buyer: req.user._id }).populate(
      "items.product",
      "name images price discountedPrice quantity status",
    );
    if (!cart) cart = { items: [], total: 0 };
    sendResponse(res, 200, "Cart fetched.", cart);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.status !== "approved")
      return next(new ErrorResponse("Product not available.", 404));
    if (product.quantity < quantity)
      return next(new ErrorResponse("Insufficient stock.", 400));

    let cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) cart = new Cart({ buyer: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountedPrice,
        subtotal: product.discountedPrice * quantity,
      });
    }

    cart.calculateTotal();
    await cart.save();
    sendResponse(res, 200, "Item added to cart.", cart);
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) return next(new ErrorResponse("Cart not found.", 404));
    const item = cart.items.id(req.params.itemId);
    if (!item) return next(new ErrorResponse("Cart item not found.", 404));
    item.quantity = quantity;
    item.subtotal = item.price * quantity;
    cart.calculateTotal();
    await cart.save();
    sendResponse(res, 200, "Cart updated.", cart);
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) return next(new ErrorResponse("Cart not found.", 404));
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId,
    );
    cart.calculateTotal();
    await cart.save();
    sendResponse(res, 200, "Item removed from cart.", cart);
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }
    sendResponse(res, 200, "Cart cleared.");
  } catch (err) {
    next(err);
  }
};
