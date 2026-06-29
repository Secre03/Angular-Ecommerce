const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: String,
  options: [String],
});

const ProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, "Description is required"] },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    discountedPrice: { type: Number, default: 0 },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
    },
    images: [{ type: String }],
    variants: [VariantSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden", "out_of_stock"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
  }
  if (this.isModified("price") || this.isModified("discount")) {
    this.discountedPrice = this.price - (this.price * this.discount) / 100;
  }
  next();
});

ProductSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
