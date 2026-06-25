const Upload = require("../models/Upload");
const { extractTravelData } = require("../services/geminiService");
const path = require("path");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    // Get file URL relative path
    const fileUrl = `/uploads/${req.file.filename}`;

    // Extract data using Gemini service
    const extractedData = await extractTravelData(
      req.file.path,
      req.file.mimetype,
      req.file.originalname
    );

    // Save to Uploads collection
    const uploadRecord = await Upload.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: fileUrl,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded and parsed successfully",
      upload: uploadRecord,
      extractedData,
    });
  } catch (error) {
    console.error("Upload Controller Error:", error);
    res.status(500).json({
      message: "Error processing document upload",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};
