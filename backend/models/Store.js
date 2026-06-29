const mongoose = require("mongoose");

const BusinessHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false },
});

const StoreSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      maxlength: 150,
    },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, maxlength: 2000 },
    logo: { type: String, default: null },
    banner: { type: String, default: null },
    contactNumber: { type: String },
    email: { type: String },
    location: {
      province: { type: String, required: [true, "Province is required"] },
      city: { type: String, required: [true, "City is required"] },
      barangay: { type: String, required: [true, "Barangay is required"] },
      completeAddress: {
        type: String,
        required: [true, "Complete address is required"],
      },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    businessHours: [BusinessHoursSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deactivated"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

StoreSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
  }
  next();
});

StoreSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model("Store", StoreSchema);
