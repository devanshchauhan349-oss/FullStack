const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    const electronics = new Category({ name: "Electronics", description: "Smartphones, laptops, gadgets" });
    const fashion = new Category({ name: "Fashion", description: "Clothing and accessories" });
    const home = new Category({ name: "Home", description: "Furniture and appliances" });

    await electronics.save();
    await fashion.save();
    await home.save();

    // Create only 5 products
    const products = [
      { name: "iPhone 15", description: "Latest Apple smartphone", price: 999, category: electronics._id, stock: 50 },
      { name: "Samsung Galaxy S24", description: "Flagship Android phone", price: 899, category: electronics._id, stock: 40 },
      { name: "Nike Air Max", description: "Popular running shoes", price: 120, category: fashion._id, stock: 100 },
      { name: "Levi’s Jeans", description: "Classic denim jeans", price: 60, category: fashion._id, stock: 200 },
      { name: "Wooden Dining Table", description: "6-seater dining table", price: 450, category: home._id, stock: 10 }
    ];

    await Product.insertMany(products);
    console.log("✅ Seed data inserted (5 products)");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
  }
}

seed();