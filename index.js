
// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv");
// // dotenv.config();
// // const stripe = require("stripe")(process.env.STRIPE_KEY);
// // const app = express();

// // // app.use(cors({ origin: true }));
// // // app.use(cors({ origin: "https://amazonefend.degefagomora.com/" }));
// // // ✅ CORS (allow localhost during dev + your production frontend)
// // const allowedOrigins = [
// //   "http://localhost:5173", // Vite default
// //   "https://amazonefend.degefagomora.com", //frontend
// // ];

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   }
// // }));
// // app.use(express.json());

// // app.get("/", (req, res) => {
// //   res.status(200).json({
// //     message: "Success !",
// //   });
// // });

// // app.post("/payment/create", async (req, res) => {
// //   const total = parseInt(req.query.total);
// //   if (total > 0) {
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: total,
// //       currency: "usd",
// //     });

// //     res.status(201).json({
// //       clientSecret: paymentIntent.client_secret,
// //     });
// //   } else {
// //     res.status(403).json({
// //       error: "Invalid total amount",
// //     });
// //   }
// // });

// // // In your backend's index.js file
// // const axios = require("axios");

// // app.get("/products", async (req, res) => {
// //   try {
// //     const response = await axios.get("https://fakestoreapi.com/products");
// //     res.status(200).json(response.data);
// //   } catch (error) {
// //     console.error("Error fetching products from Fakestore API:", error);
// //     res.status(500).json({ message: "Failed to fetch products" });
// //   }
// // });

// // const axios = require("axios");

// // app.get("/image-proxy", async (req, res) => {
// //   const imageUrl = req.query.url; // Get the image URL from a query parameter

// //   if (!imageUrl) {
// //     return res.status(400).send("Image URL is required.");
// //   }

// //   try {
// //     const response = await axios.get(imageUrl, { responseType: "stream" });

// //     // Set content type and length headers
// //     res.setHeader("Content-Type", response.headers["content-type"]);
// //     res.setHeader("Content-Length", response.headers["content-length"]);

// //     // Pipe the image data directly to the response
// //     response.data.pipe(res);
// //   } catch (error) {
// //     console.error("Error proxying image:", error);
// //     res.status(500).send("Failed to load image.");
// //   }
// // });

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`Amazon Server Running on PORT: ${PORT}`);
// // });

// // // app.listen(5000, (err) => {
// // //   if (err) throw err;
// // //   console.log("Amazon Server Running on PORT: 5000, http://localhost:5000");
// // // });



// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const stripe = require("stripe")(process.env.STRIPE_KEY);
// const axios = require("axios");

// dotenv.config();

// const app = express();

// // ✅ In-memory cache for products to improve performance
// const cache = {};
// const CACHE_LIFETIME = 300000; // 5 minutes in milliseconds

// // ✅ CORS (allow localhost during dev + your production frontend)
// const allowedOrigins = [
//   "http://localhost:5173", // Vite default
//   "https://amazonefend.degefagomora.com", // frontend
// ];

// app.use(cors({ origin: allowedOrigins }));
// app.use(express.json());

// // Main route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Success!",
//   });
// });

// // ✅ Products proxy route with caching
// app.get("/products", async (req, res) => {
//   const cacheKey = "products_all";

//   // Check if data is in the cache and not expired
//   if (
//     cache[cacheKey] &&
//     Date.now() - cache[cacheKey].timestamp < CACHE_LIFETIME
//   ) {
//     console.log("Serving products from cache");
//     return res.status(200).json(cache[cacheKey].data);
//   }

//   try {
//     console.log("Fetching products from Fakestore API...");
//     const response = await axios.get("https://fakestoreapi.com/products");

//     // Store the fresh data in the cache
//     cache[cacheKey] = {
//       data: response.data,
//       timestamp: Date.now(),
//     };

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error fetching products from Fakestore API:", error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// });

// // ✅ Image proxy route
// app.get("/image-proxy", async (req, res) => {
//   const imageUrl = req.query.url;

//   if (!imageUrl) {
//     return res.status(400).send("Image URL is required.");
//   }

//   try {
//     const response = await axios.get(imageUrl, { responseType: "stream" });
//     res.setHeader("Content-Type", response.headers["content-type"]);
//     res.setHeader("Content-Length", response.headers["content-length"]);
//     response.data.pipe(res);
//   } catch (error) {
//     console.error("Error proxying image:", error);
//     res.status(500).send("Failed to load image.");
//   }
// });

// // ✅ Payment route (using request body for security)
// app.post("/payment/create", async (req, res) => {
//   const { total } = req.body; // Use request body instead of query parameters

//   if (!total || isNaN(total) || total <= 0) {
//     return res.status(400).json({
//       error: "Invalid or missing total amount",
//     });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "usd",
//     });

//     res.status(201).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe API error:", error);
//     res.status(500).json({
//       error: "Failed to create payment intent",
//     });
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Amazon Server Running on PORT: ${PORT}`);
// });

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const stripe = require("stripe")(process.env.STRIPE_KEY);
// const axios = require("axios");
// const mongoose = require("mongoose");

// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv"); // Correct order: require first

// dotenv.config(); // Correct order: config() second, before anything else

// const stripe = require("stripe")(process.env.STRIPE_KEY); // Now it can read the key
// // console.log("Stripe Key:", process.env.STRIPE_KEY); // This will now show your key


// const app = express();

// // ✅ MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected successfully."))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // ✅ Product Schema and Model
// const productSchema = new mongoose.Schema({
//   id: { type: Number, unique: true, required: true },
//   title: String,
//   price: Number,
//   description: String,
//   category: String,
//   image: String,
//   rating: {
//     rate: Number,
//     count: Number,
//   },
// });

// const Product = mongoose.model("Product", productSchema);

// // ✅ CORS (allow localhost during dev + your production frontend)
// // const allowedOrigins = [
// //   "http://localhost:5173", // Vite default
// //   "https://amazonefend.degefagomora.com", // frontend
// // ];

// // app.use(cors({ origin: allowedOrigins }));

// const allowedOrigins = [
//   "http://localhost:5173", // Allow your local development server
//   "https://amazonefend.degefagomora.com", // Allow your deployed frontend
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );
// app.use(express.json());

// // Main route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Success!",
//   });
// });

// // ✅ Products route fetches from MongoDB (no more Fakestore API)
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products from DB:", error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// });

// // ✅ Image proxy route
// app.get("/image-proxy", async (req, res) => {
//   const imageUrl = req.query.url;

//   if (!imageUrl) {
//     return res.status(400).send("Image URL is required.");
//   }

//   try {
//     const response = await axios.get(imageUrl, { responseType: "stream" });
//     res.setHeader("Content-Type", response.headers["content-type"]);
//     res.setHeader("Content-Length", response.headers["content-length"]);
//     response.data.pipe(res);
//   } catch (error) {
//     console.error("Error proxying image:", error);
//     res.status(500).send("Failed to load image.");
//   }
// });

// // ✅ Payment route
// app.post("/payment/create", async (req, res) => {
//   const { total } = req.body;

//   if (!total || isNaN(total) || total <= 0) {
//     return res.status(400).json({
//       error: "Invalid or missing total amount",
//     });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "usd",
//     });

//     res.status(201).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe API error:", error);
//     res.status(500).json({
//       error: "Failed to create payment intent",
//     });
//   }
// });
// app.get("/products/category/:categoryName", async (req, res) => {
//   const { categoryName } = req.params;
//   try {
//     // Find products in your MongoDB that match the category
//     const products = await Product.find({ category: categoryName });
//     if (products.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No products found in this category." });
//     }
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching category products from DB:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch products for this category." });
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Amazon Server Running on PORT: ${PORT}`);
// });



// rrrrrrrrrrrrrrrrrrr
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Product Schema and Model
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

// ✅ CORS (allow localhost during dev + your production frontend)
const allowedOrigins = [
  "http://localhost:5173", // Allow your local development server
  "https://amazan.degefagomora.com", // Allow your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

// ✅ Products route fetches from MongoDB
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ✅ Image proxy route
app.get("/image-proxy", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("Image URL is required.");
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Length", response.headers["content-length"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).send("Failed to load image.");
  }
});

// ✅ Payment route
// app.post("/payment/create", async (req, res) => {
//   const { total } = req.body;

//   if (!total || isNaN(total) || total <= 0) {
//     return res.status(400).json({
//       error: "Invalid or missing total amount",
//     });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "usd",
//     });

//     res.status(201).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe API error:", error);
//     res.status(500).json({
//       error: "Failed to create payment intent",
//     });
//   }
// });

// ✅ Payment route
// ✅ Corrected Payment route
app.post("/payment/create", async (req, res) => {
  // Use req.query to get the total from the URL
  const { total } = req.query; 

  // Convert total to a number before validation and use
  const amountInCents = parseInt(total, 10); 

  if (!amountInCents || isNaN(amountInCents) || amountInCents <= 0) {
    return res.status(400).json({
      error: "Invalid or missing total amount",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe API error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
    });
  }
});

app.get("/products/category/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.find({ category: categoryName });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category." });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching category products from DB:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products for this category." });
  }
});

app.get("/products/:productID", async (req, res) => {
  const { productID } = req.params;
  try {
    const product = await Product.findOne({ id: productID });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching single product from DB:", error);
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Amazon Server Running on PORT: ${PORT}`);
});