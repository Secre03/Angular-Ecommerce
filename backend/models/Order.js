const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  barangay: { type: String, required: true },
  completeAddress: { type: String, required: true },
  zipCode: { type: String },
  notes: { type: String },
});

const StatusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
});

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    orderNumber: { type: String, unique: true },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "returned",
        "refund_requested",
        "refunded",
      ],
      default: "pending",
    },
    statusHistory: [StatusHistorySchema],
    cancelReason: { type: String, default: null },
    refundReason: { type: String, default: null },
    paymentMethod: { type: String, default: "cod" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

OrderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber =
      "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
