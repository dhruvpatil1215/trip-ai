const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createItinerary,
  getItineraries,
  getItineraryById,
  deleteItinerary,
  getSharedItinerary,
  getDashboardStats,
} = require("../controllers/itineraryController");

// Public route to view a shared itinerary
router.get("/share/:shareId", getSharedItinerary);

// Protected routes (require valid JWT)
router.post("/", protect, createItinerary);
router.get("/", protect, getItineraries);
router.get("/stats", protect, getDashboardStats);
router.get("/:id", protect, getItineraryById);
router.delete("/:id", protect, deleteItinerary);

module.exports = router;
