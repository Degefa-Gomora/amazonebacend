// models/Product.js
const mongoose = require("mongoose");

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

module.exports = Product;
