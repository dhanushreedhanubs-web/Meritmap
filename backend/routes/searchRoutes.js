const express = require("express");
const { searchScholarships } = require("../services/serpApiService");
const Scholarship = require("../models/Scholarship");

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const results = await searchScholarships(query);

    const scholarships = results.map((result) => ({
  title: result.title || "Untitled Scholarship",
  description: result.snippet || "",
  applicationLink: result.link || "",
  source: "SerpApi"
}));

const savedScholarships = [];

for (const scholarship of scholarships) {
  const existingScholarship = await Scholarship.findOne({
    applicationLink: scholarship.applicationLink
  });

  if (existingScholarship) {
    savedScholarships.push(existingScholarship);
  } else {
    const newScholarship = await Scholarship.create(scholarship);
    savedScholarships.push(newScholarship);
  }
}
    res.json({
      success: true,
      query: query,
      scholarships: savedScholarships
    });

  } catch (error) {
    console.error("Scholarship search failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Scholarship search failed"
    });
  }
});

module.exports = router;