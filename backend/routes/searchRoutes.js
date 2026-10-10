const express = require("express");
const axios = require("axios");
const Scholarship = require("../models/Scholarship");
const checkEligibility = require("../../ai/eligibility");

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

    // 1. Search scholarships using the SerpApi Flask service
    const response = await axios.post(
      "http://127.0.0.1:5001/search",
      student
    );

    const results = response.data.scholarships || [];

    // 2. Convert search results into our Scholarship model format
    const scholarships = results.map((result) => ({
      title: result.name || "Untitled Scholarship",
      description: result.benefits || "",
      eligibility: Array.isArray(result.categories)
        ? result.categories.join(", ")
        : "",
      applicationLink: result.link || "",
      amount: result.benefits || "",
      source: result.state || "SerpApi",

      // Save criteria only when the search service actually provides them
      state: result.state || undefined,
      courses: Array.isArray(result.courses) ? result.courses : [],
      incomeLimit: result.incomeLimit ?? result.income_limit ?? undefined,
      minimumMarks: result.minimumMarks ?? result.minimum_marks ?? undefined,
      minimumMarksRequired:
        result.minimumMarksRequired ??
        result.minimum_marks_required ??
        false,
      categories: Array.isArray(result.categories)
        ? result.categories
        : [],
      minAge: result.minAge ?? result.min_age ?? undefined,
      maxAge: result.maxAge ?? result.max_age ?? undefined,
      ageRequired: result.ageRequired ?? result.age_required ?? false,
      genders: Array.isArray(result.genders) ? result.genders : [],
      genderRequired:
        result.genderRequired ?? result.gender_required ?? false,
      disabilityRequired:
        result.disabilityRequired ??
        result.disability_required ??
        false
    }));

    // 3. Save or reuse scholarships in MongoDB
    const savedScholarships = [];

    for (const scholarship of scholarships) {
      let savedScholarship = null;

      if (scholarship.applicationLink) {
        savedScholarship = await Scholarship.findOne({
          applicationLink: scholarship.applicationLink
        });
      }

      if (savedScholarship) {
        // Update stored scholarship information with the latest search result
        Object.assign(savedScholarship, scholarship);
        await savedScholarship.save();
      } else {
        savedScholarship = await Scholarship.create(scholarship);
      }

      savedScholarships.push(savedScholarship);
    }

    // 4. Evaluate each saved scholarship using the AI eligibility checker
    const resultsWithEligibility = savedScholarships.map((scholarship) => {
      const eligibilityResult = checkEligibility(
        student,
        scholarship.toObject()
      );

      return {
        ...scholarship.toObject(),
        eligibilityResult
      };
    });

    // 5. Return scholarships with AI results
    return res.json({
      success: true,
      count: resultsWithEligibility.length,
      scholarships: resultsWithEligibility
    });

  } catch (error) {
    console.error("Scholarship search failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Scholarship search failed"
    });
  }
});

module.exports = router;