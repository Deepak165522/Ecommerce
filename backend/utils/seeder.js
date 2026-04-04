const mongoose = require("mongoose");
const Product = require("../models/productModel");
const User = require("../models/userModel"); // ✅ ADD THIS
require("dotenv").config();

const productsData = [
  {
    name: "iPhone 17 Pro Max",
    price: 139900,
    cuttedPrice: 155000,
    description: "Latest Apple iPhone",
    ratings: 4.5,
    images: [
      {
        public_id: "sample",
        url: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd"
      }
    ],
    category: "Mobiles",
    seller: "Apple",
    stock: 50,
    numOfReviews: 10,

    brand: {
      name: "Apple",
      logo: {
        public_id: "sample",
        url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
      }
    },
  },

  {
    name: "Dell Laptop",
    price: 50000,
    cuttedPrice: 60000,
    description: "Powerful laptop",
    ratings: 4.2,
    images: [
      {
        public_id: "sample",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
      }
    ],
    category: "Laptops",
    seller: "Dell",
    stock: 30,
    numOfReviews: 5,

    brand: {
      name: "Dell",
      logo: {
        public_id: "sample",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg"
      }
    },
  },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo Connected");
};

const seed = async () => {
  try {
    await connectDB();

    // 🔥 USER FETCH (IMPORTANT)
    const user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Please register first.");
      process.exit();
    }

    // 🔥 ADD USER ID TO PRODUCTS
    const products = productsData.map((product) => ({
      ...product,
      user: user._id,
    }));

    await Product.deleteMany();
    console.log("Old Deleted");

    await Product.insertMany(products);
    console.log("Inserted");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();