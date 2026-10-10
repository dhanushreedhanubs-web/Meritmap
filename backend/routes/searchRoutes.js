const express = require("express");
const axios = require("axios");
const Scholarship = require("../models/Scholarship");

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const student = req.body;

    if (!student || !student.state || !student.course || !student.category) {
      return res.status(400).json({
        success: false,
        message: "Student profile with state, course and category is required"
      });
    }

    const response = await axios.post(
      "http://127.0.0.1:5001/search",
      student
    );

    const results = response.data.scholarships || [];

    const scholarships = results.map((result) => ({
      title: result.name || "Untitled Scholarship",
      description: result.benefits || "",
      eligibility: result.categories
        ? result.categories.join(", ")
        : "",
      applicationLink: result.link || "",
      amount: result.benefits || "",
      source: result.state || "SerpApi"
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