const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });
    sendResponse(res, 200, "Categories fetched.", categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorResponse("Category not found.", 404));
    sendResponse(res, 200, "Category fetched.", category);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    sendResponse(res, 201, "Category created.", category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return next(new ErrorResponse("Category not found.", 404));
    sendResponse(res, 200, "Category updated.", category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ErrorResponse("Category not found.", 404));
    sendResponse(res, 200, "Category deleted.");
  } catch (err) {
    next(err);
  }
};
