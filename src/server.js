require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const productRoutes = require("./routes/product.routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Product API is running",
  });
});

// Product API routes
app.use("/api/products", productRoutes);

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Product API is running on port ${PORT}`);
  });
};

startServer();
