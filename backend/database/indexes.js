/**
 * MongoDB Index Setup
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("../config/db");
const mongoose = require("mongoose");

const User = require("../models/User");
const Store = require("../models/Store");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

const createIndexes = async () => {
  await connectDB();
  console.log("Creating indexes...");

  await User.collection.createIndex({ email: 1 }, { unique: true });
  await User.collection.createIndex({ role: 1 });
  await User.collection.createIndex({ isDeleted: 1, isActive: 1 });

  await Store.collection.createIndex({ owner: 1 });
  await Store.collection.createIndex({ status: 1 });
  await Store.collection.createIndex({ slug: 1 }, { unique: true });
  await Store.collection.createIndex({ "location.city": 1 });

  await Product.collection.createIndex({ seller: 1, status: 1 });
  await Product.collection.createIndex({ store: 1 });
  await Product.collection.createIndex({ category: 1 });
  await Product.collection.createIndex({ status: 1 });
  await Product.collection.createIndex({ name: "text", description: "text" });
  await Product.collection.createIndex({ discountedPrice: 1 });

  await Order.collection.createIndex({ buyer: 1, status: 1 });
  await Order.collection.createIndex({ seller: 1, status: 1 });
  await Order.collection.createIndex({ orderNumber: 1 }, { unique: true });
  await Order.collection.createIndex({ createdAt: -1 });

  await Notification.collection.createIndex({ recipient: 1, isRead: 1 });
  await Notification.collection.createIndex({ createdAt: -1 });

  console.log("Indexes created successfully.");
  process.exit(0);
};

createIndexes().catch((err) => {
  console.error("Index creation error:", err);
  process.exit(1);
});
