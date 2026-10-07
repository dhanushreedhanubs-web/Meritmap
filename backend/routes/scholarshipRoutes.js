const express = require("express");
const Scholarship = require("../models/Scholarship");

const router = express.Router();

// Get all scholarships
router.get("/scholarships", async (req, res) => {
  try {
    const scholarships = await Scholarship.find();

    res.json({
      success: true,
      scholarships: scholarships
    });
  } catch (error) {
    console.error("Failed to fetch scholarships:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarships"
    });
  }
});

// Add a scholarship
router.post("/scholarships", async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);

    const savedScholarship = await scholarship.save();

    res.status(201).json({
      success: true,
      message: "Scholarship saved successfully",
      scholarship: savedScholarship
    });
  } catch (error) {
    console.error("Scholarship save failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save scholarship"
    });
  }
});

router.get("/scholarships/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found"
      });
    }

    res.json({
      success: true,
      scholarship: scholarship
    });
  } catch (error) {
    console.error("Failed to fetch scholarship:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarship"
    });
  }
});

module.exports = router;