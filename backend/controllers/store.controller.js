const Store = require("../models/Store");
const Notification = require("../models/Notification");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const paginate = require("../utils/pagination");

exports.createStore = async (req, res, next) => {
  try {
    const existing = await Store.findOne({ owner: req.user._id });
    if (existing)
      return next(new ErrorResponse("You already have a store.", 400));
    const store = await Store.create({ ...req.body, owner: req.user._id });
    sendResponse(res, 201, "Store created. Waiting for admin approval.", store);
  } catch (err) {
    next(err);
  }
};

exports.getMyStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store)
      return next(new ErrorResponse("You do not have a store yet.", 404));
    sendResponse(res, 200, "Store fetched.", store);
  } catch (err) {
    next(err);
  }
};

exports.updateStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    const updated = await Store.findByIdAndUpdate(store._id, req.body, {
      new: true,
      runValidators: true,
    });
    sendResponse(res, 200, "Store updated.", updated);
  } catch (err) {
    next(err);
  }
};

exports.uploadStoreLogo = async (req, res, next) => {
  try {
    if (!req.file) return next(new ErrorResponse("Please upload a file.", 400));
    const store = await Store.findOneAndUpdate(
      { owner: req.user._id },
      { logo: req.file.filename },
      { new: true },
    );
    sendResponse(res, 200, "Store logo uploaded.", { logo: store.logo });
  } catch (err) {
    next(err);
  }
};

exports.uploadStoreBanner = async (req, res, next) => {
  try {
    if (!req.file) return next(new ErrorResponse("Please upload a file.", 400));
    const store = await Store.findOneAndUpdate(
      { owner: req.user._id },
      { banner: req.file.filename },
      { new: true },
    );
    sendResponse(res, 200, "Store banner uploaded.", { banner: store.banner });
  } catch (err) {
    next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    store.isDeleted = true;
    await store.save();
    sendResponse(res, 200, "Store deleted.");
  } catch (err) {
    next(err);
  }
};

// Public: get all approved stores
exports.getStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { status: "approved" };
    if (search) query.name = { $regex: search, $options: "i" };
    const result = await paginate(Store, query, page, limit, "owner");
    sendResponse(res, 200, "Stores fetched.", result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate(
      "owner",
      "name email",
    );
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    sendResponse(res, 200, "Store fetched.", store);
  } catch (err) {
    next(err);
  }
};

// Admin
exports.approveStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: null },
      { new: true },
    );
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    await Notification.create({
      recipient: store.owner,
      title: "Store Approved",
      message: `Your store "${store.name}" has been approved.`,
      type: "store_approved",
    });
    sendResponse(res, 200, "Store approved.", store);
  } catch (err) {
    next(err);
  }
};

exports.rejectStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: req.body.reason || "No reason provided.",
      },
      { new: true },
    );
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    await Notification.create({
      recipient: store.owner,
      title: "Store Rejected",
      message: `Your store "${store.name}" was rejected. Reason: ${store.rejectionReason}`,
      type: "store_rejected",
    });
    sendResponse(res, 200, "Store rejected.", store);
  } catch (err) {
    next(err);
  }
};

exports.deactivateStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { status: "deactivated" },
      { new: true },
    );
    if (!store) return next(new ErrorResponse("Store not found.", 404));
    sendResponse(res, 200, "Store deactivated.", store);
  } catch (err) {
    next(err);
  }
};
