require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Store = require("../models/Store");
const Product = require("../models/Product");

const categories = [
  {
    name: "Electronics",
    description: "Gadgets, devices, and tech accessories",
  },
  { name: "Fashion", description: "Clothing, shoes, and accessories" },
  { name: "Groceries", description: "Food and daily essentials" },
  { name: "Beauty", description: "Skincare, makeup, and personal care" },
  { name: "Sports", description: "Sporting goods and fitness equipment" },
  { name: "Pets", description: "Pet food, toys, and accessories" },
  { name: "Furniture", description: "Home and office furniture" },
  { name: "Others", description: "Miscellaneous items" },
];

const seedDB = async () => {
  await connectDB();

  console.log("🗑️  Clearing existing data...");
  await User.deleteMany({});
  await Category.deleteMany({});
  await Store.deleteMany({});
  await Product.deleteMany({});

  console.log("👤 Creating admin user...");
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("Admin@1234", salt);

  // Bypass pre-save hook for seeder (password already hashed)
  await User.collection.insertOne({
    name: "Super Admin",
    email: "admin@ecommerce.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("👤 Creating seller user...");
  const sellerPassword = await bcrypt.hash("Seller@1234", salt);
  const seller = await User.collection.insertOne({
    name: "Sample Seller",
    email: "seller@ecommerce.com",
    password: sellerPassword,
    role: "seller",
    isVerified: true,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("👤 Creating buyer user...");
  const buyerPassword = await bcrypt.hash("Buyer@1234", salt);
  await User.collection.insertOne({
    name: "Sample Buyer",
    email: "buyer@ecommerce.com",
    password: buyerPassword,
    role: "buyer",
    isVerified: true,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("📂 Creating categories...");
  const createdCategories = await Category.insertMany(
    categories.map((c) => ({
      ...c,
      slug: c.name.toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
    })),
  );

  console.log("🏪 Creating sample store...");
  const store = await Store.collection.insertOne({
    owner: seller.insertedId,
    name: "Sample Tech Store",
    slug: "sample-tech-store-" + Date.now(),
    description: "A sample store selling tech products.",
    logo: null,
    banner: null,
    contactNumber: "09123456789",
    email: "techstore@email.com",
    location: {
      province: "Albay",
      city: "Legazpi City",
      barangay: "Sagpon",
      completeAddress: "123 Main St, Sagpon, Legazpi City, Albay",
      latitude: 13.1391,
      longitude: 123.7438,
    },
    status: "approved",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Creating sample products...");
  const electronicsCategory = createdCategories.find(
    (c) => c.name === "Electronics",
  );
  await Product.collection.insertMany([
    {
      seller: seller.insertedId,
      store: store.insertedId,
      category: electronicsCategory._id,
      name: "Wireless Bluetooth Earbuds",
      slug: "wireless-bluetooth-earbuds-" + Date.now(),
      description: "High-quality wireless earbuds with noise cancellation.",
      sku: "SKU-EARBUDS-001",
      price: 1299,
      discount: 10,
      discountedPrice: 1169.1,
      quantity: 50,
      images: [],
      status: "approved",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      seller: seller.insertedId,
      store: store.insertedId,
      category: electronicsCategory._id,
      name: "USB-C Fast Charger",
      slug: "usb-c-fast-charger-" + Date.now() + 1,
      description: "65W USB-C fast charger compatible with all devices.",
      sku: "SKU-CHARGER-001",
      price: 599,
      discount: 0,
      discountedPrice: 599,
      quantity: 100,
      images: [],
      status: "approved",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log("\n✅ Database seeded successfully!\n");
  console.log("=".repeat(40));
  console.log("🔑 Login Credentials:");
  console.log("=".repeat(40));
  console.log("ADMIN   → admin@ecommerce.com   / Admin@1234");
  console.log("SELLER  → seller@ecommerce.com  / Seller@1234");
  console.log("BUYER   → buyer@ecommerce.com   / Buyer@1234");
  console.log("=".repeat(40));

  process.exit(0);
};

seedDB().catch((err) => {
  console.error("Seeder error:", err);
  process.exit(1);
});
