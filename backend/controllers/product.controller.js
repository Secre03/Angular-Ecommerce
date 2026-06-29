const Product = require("../models/Product");
const Store = require("../models/Store");
const Notification = require("../models/Notification");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const paginate = require("../utils/pagination");

exports.createProduct = async (req, res, next) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
      status: "approved",
    });
    if (!store)
      return next(
        new ErrorResponse("You need an approved store to add products.", 403),
      );
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
      store: store._id,
    });
    sendResponse(
      res,
      201,
      "Product created. Waiting for admin approval.",
      product,
    );
  } catch (err) {
    next(err);
  }
};

exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      return next(new ErrorResponse("Please upload at least one image.", 400));
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    const images = req.files.map((f) => f.filename);
    product.images.push(...images);
    await product.save();
    sendResponse(res, 200, "Images uploaded.", { images: product.images });
  } catch (err) {
    next(err);
  }
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { seller: req.user._id };
    if (status) query.status = status;
    const result = await paginate(Product, query, page, limit, "category");
    sendResponse(res, 200, "Products fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getMyProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    }).populate("category store");
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    sendResponse(res, 200, "Product fetched.", product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    sendResponse(res, 200, "Product updated.", product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    product.isDeleted = true;
    await product.save();
    sendResponse(res, 200, "Product deleted.");
  } catch (err) {
    next(err);
  }
};

// Public routes
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      storeId,
    } = req.query;
    const query = { status: "approved" };
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (storeId) query.store = storeId;
    if (minPrice || maxPrice)
      query.discountedPrice = {
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice }),
      };
    const result = await paginate(Product, query, page, limit, [
      { path: "category", select: "name" },
      { path: "store", select: "name slug" },
    ]);
    sendResponse(res, 200, "Products fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category store seller",
    );
    if (!product || product.status !== "approved")
      return next(new ErrorResponse("Product not found.", 404));
    sendResponse(res, 200, "Product fetched.", product);
  } catch (err) {
    next(err);
  }
};

// Admin
exports.approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    await Notification.create({
      recipient: product.seller,
      title: "Product Approved",
      message: `Your product "${product.name}" has been approved.`,
      type: "product_approved",
    });
    sendResponse(res, 200, "Product approved.", product);
  } catch (err) {
    next(err);
  }
};

exports.rejectProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: req.body.reason || "No reason provided.",
      },
      { new: true },
    );
    if (!product) return next(new ErrorResponse("Product not found.", 404));
    await Notification.create({
      recipient: product.seller,
      title: "Product Rejected",
      message: `Your product "${product.name}" was rejected. Reason: ${product.rejectionReason}`,
      type: "product_rejected",
    });
    sendResponse(res, 200, "Product rejected.", product);
  } catch (err) {
    next(err);
  }
};
