const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: null },
    icon: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
