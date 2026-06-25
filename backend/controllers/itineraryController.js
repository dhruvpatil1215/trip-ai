const Itinerary = require("../models/Itinerary");
const Upload = require("../models/Upload");
const { generateItineraryPlan } = require("../services/geminiService");

// Helper to generate a unique share ID
const generateShareId = () => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Generate a new travel itinerary based on extracted data
 */
const createItinerary = async (req, res) => {
  try {
    const { extractedData } = req.body;

    if (!extractedData) {
      return res.status(400).json({ message: "Extracted data is required" });
    }

    // Generate the itinerary using Gemini
    const generatedItinerary = await generateItineraryPlan(extractedData);

    const shareId = generateShareId();

    const itinerary = await Itinerary.create({
      userId: req.user._id,
      destination: extractedData.destination || "Unknown Destination",
      startDate: new Date(extractedData.startDate || Date.now()),
      endDate: new Date(extractedData.endDate || Date.now()),
      extractedData,
      generatedItinerary,
      shareId,
    });

    res.status(201).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error("Create Itinerary Error:", error);
    res.status(500).json({
      message: "Error generating itinerary",
      error: error.message,
    });
  }
};

/**
 * Get all itineraries for the logged-in user (with search, sort, filter)
 */
const getItineraries = async (req, res) => {
  try {
    const { search, sort, filter } = req.query;
    let query = { userId: req.user._id };

    // Search filter (by destination)
    if (search) {
      query.destination = { $regex: search, $options: "i" };
    }

    // Date range filter
    if (filter === "upcoming") {
      query.startDate = { $gte: new Date() };
    } else if (filter === "past") {
      query.endDate = { $lt: new Date() };
    }

    // Build query builder
    let dbQuery = Itinerary.find(query);

    // Sorting
    if (sort === "dateAsc") {
      dbQuery = dbQuery.sort({ startDate: 1 });
    } else if (sort === "dateDesc") {
      dbQuery = dbQuery.sort({ startDate: -1 });
    } else {
      // Default: newly created first
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    const itineraries = await dbQuery;

    res.status(200).json({
      success: true,
      itineraries,
    });
  } catch (error) {
    console.error("Get Itineraries Error:", error);
    res.status(500).json({
      message: "Error fetching itineraries",
      error: error.message,
    });
  }
};

/**
 * Get a single itinerary by ID
 */
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check ownership
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error("Get Itinerary By ID Error:", error);
    res.status(500).json({
      message: "Error fetching itinerary details",
      error: error.message,
    });
  }
};

/**
 * Delete an itinerary
 */
const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check ownership
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    console.error("Delete Itinerary Error:", error);
    res.status(500).json({
      message: "Error deleting itinerary",
      error: error.message,
    });
  }
};

/**
 * Get a shared itinerary by share ID (Public Access)
 */
const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareId: req.params.shareId });

    if (!itinerary) {
      return res.status(404).json({ message: "Shared itinerary not found" });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error("Get Shared Itinerary Error:", error);
    res.status(500).json({
      message: "Error fetching shared itinerary",
      error: error.message,
    });
  }
};

/**
 * Get quick dashboard statistics for the logged-in user
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTrips = await Itinerary.countDocuments({ userId });
    const savedItineraries = totalTrips; // In this schema, every itinerary is saved
    const uploadedDocuments = await Upload.countDocuments({ userId });
    const upcomingTrips = await Itinerary.countDocuments({
      userId,
      startDate: { $gte: new Date() },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTrips,
        savedItineraries,
        uploadedDocuments,
        upcomingTrips,
      },
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({
      message: "Error calculating dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createItinerary,
  getItineraries,
  getItineraryById,
  deleteItinerary,
  getSharedItinerary,
  getDashboardStats,
};
