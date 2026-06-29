const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "store_approved",
        "store_rejected",
        "product_approved",
        "product_rejected",
        "order_placed",
        "order_approved",
        "order_shipped",
        "order_delivered",
        "order_cancelled",
        "order_completed",
        "refund_requested",
        "refunded",
        "general",
      ],
      default: "general",
    },
    link: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", NotificationSchema);
