const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/itineraries", itineraryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trrip AI Backend Running 🚀",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});