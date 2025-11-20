// // importData.js
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: {
      rate: Number,
      count: Number,
    },
  });

const Product = mongoose.model("Product", productSchema);

const importProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");

    await Product.deleteMany({}); // Clear existing data
    console.log("Existing data cleared.");

    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data.map(item => ({
      ...item,
      rating: { rate: item.rating.rate, count: item.rating.count }
    }));

    await Product.insertMany(products);
    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importProducts();