const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tileRoutes = require("./routes/tileRoute");
const tileCategoryRoutes = require("./routes/tileCategoryRoutes");
const tileColorRoutes = require("./routes/tileColorRoutes");

dotenv.config();

const app = express();

// CORS config
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Log only important requests
app.use((req, res, next) => {
  // Skip logging for GET requests to reduce console spam
  if (req.method !== 'GET') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

app.use(express.json());

// API routes
app.use("/api/tiles", tileRoutes);
app.use("/api", authRoutes);
app.use("/api", tileCategoryRoutes);
app.use("/api/colors", tileColorRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
