const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
      default: "Unknown Destination",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    extractedData: {
      type: Object,
      required: true,
    },
    generatedItinerary: {
      type: Object,
      required: true,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
