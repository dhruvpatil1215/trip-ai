const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadDocument } = require("../controllers/uploadController");

// Protected upload endpoint
router.post("/", protect, upload.single("file"), uploadDocument);

module.exports = router;
