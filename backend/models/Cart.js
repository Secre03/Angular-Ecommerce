const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce((acc, item) => acc + item.subtotal, 0);
};

module.exports = mongoose.model("Cart", CartSchema);
