const express = require("express");
const axios = require("axios");
const Scholarship = require("../models/Scholarship");
const checkEligibility = require("../../ai/eligibility");
const { explainEligibility } = require("../aiService");
console.log("MERITMAP SEARCH ROUTE LOADED");

const router = express.Router();

router.post("/search", async (req, res) => {
  console.log("SEARCH ROUTE VERSION CHECK");
  
  try {
    const student = req.body;

    // Validate student profile
    if (
      !student ||
      !student.state ||
      !student.course ||
      !student.category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student profile with state, course and category is required",
      });
    }

    // Get scholarships from the search service
    const response = await axios.post(
      "http://127.0.0.1:5001/search",
      student
    );

  const requestedState = (student.state || "").trim().toLowerCase();

const results = (response.data.scholarships || []).filter((result) => {
  const scholarshipState = (result.state || "").trim().toLowerCase();

  const text = [
    result.name,
    result.title,
    result.description,
    result.eligibility,
    result.benefits
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Exclude results explicitly referring to Chhattisgarh
  // when the student selected Karnataka.
  if (
    requestedState === "karnataka" &&
    (text.includes("chhattisgarh") ||
      text.includes("c.g. domicile"))
  ) {
    return false;
  }

  // Keep matching-state and unknown-state results.
  return !scholarshipState || scholarshipState === requestedState;
});
    // Normalize scholarship fields
    const scholarships = results.map((result) => ({
      title: result.name || result.title || "Untitled Scholarship",
      description: result.description || result.benefits || "",
      eligibility: Array.isArray(result.categories)
        ? result.categories.join(", ")
        : result.eligibility || "",
      applicationLink: result.link || result.applicationLink || "",
      amount: result.amount || result.benefits || "",
      source: result.source || "SerpApi",

    state: result.state || "Unknown",

      courses: Array.isArray(result.courses)
        ? result.courses
        : [],

      incomeLimit:
        result.incomeLimit ??
        result.income_limit ??
        undefined,

      minimumMarks:
        result.minimumMarks ??
        result.minimum_marks ??
        undefined,

      minimumMarksRequired:
        result.minimumMarksRequired ??
        result.minimum_marks_required ??
        false,

      categories: Array.isArray(result.categories)
        ? result.categories
        : [],

      minAge: result.minAge ?? result.min_age ?? undefined,
      maxAge: result.maxAge ?? result.max_age ?? undefined,

      ageRequired:
        result.ageRequired ??
        result.age_required ??
        false,

      genders: Array.isArray(result.genders)
        ? result.genders
        : [],

      genderRequired:
        result.genderRequired ??
        result.gender_required ??
        false,

      disabilityRequired:
        result.disabilityRequired ??
        result.disability_required ??
        false,
    }));

    // Save or update scholarships in MongoDB
   const savedScholarships = [];
const seenLinks = new Set();

for (const scholarship of scholarships) {
  const link = (scholarship.applicationLink || "").trim();

  // Skip duplicate application links in this search
  if (link && seenLinks.has(link)) {
    console.log("Skipped duplicate scholarship:", scholarship.title);
    continue;
  }

  if (link) {
    seenLinks.add(link);
  }

  let savedScholarship = null;

  if (link) {
    savedScholarship = await Scholarship.findOne({
      applicationLink: link,
    });
  }

  if (savedScholarship) {
    Object.assign(savedScholarship, scholarship);
    await savedScholarship.save();
  } else {
    savedScholarship = await Scholarship.create(scholarship);
  }

  savedScholarships.push(savedScholarship);
}

    // Check eligibility and generate AI explanations
    const resultsWithEligibility = await Promise.all(
      savedScholarships.map(async (scholarship) => {
        const scholarshipData = scholarship.toObject();

        // Existing eligibility checker is authoritative
        const eligibilityResult = checkEligibility(
          student,
          scholarshipData
        );
        console.log("Student profile:", student);
        console.log("Scholarship:", scholarshipData.title);
        console.log("Eligibility result:", eligibilityResult);  

        let aiExplanation = null;
        let aiExplanationError = null;

        try {
          aiExplanation = await explainEligibility({
            student,
            scholarship: scholarshipData,
            eligibilityResult,
          });

          console.log(
            "AI explanation generated:",
            scholarshipData.title,
            aiExplanation
          );
          console.log("FINAL ELIGIBILITY RESPONSE:", {
             title: scholarshipData.title,
                  eligibilityResult,
                   aiExplanation,
                 missingInformation: aiExplanation?.missingInformation,
          });
        } catch (error) {
          aiExplanationError = error.message;

          console.error(
            "AI explanation failed for:",
            scholarshipData.title,
            error.message
          );
        }

        return {
          ...scholarshipData,
          eligibilityResult,
          aiExplanation,
          ...(aiExplanationError
            ? { aiExplanationError }
            : {}),
        };
      })
    );

    // Send results to frontend
    return res.status(200).json({
      success: true,
      count: resultsWithEligibility.length,
      scholarships: resultsWithEligibility,
    });
  } catch (error) {
    console.error("Scholarship search failed:", error.message);

    if (error.response) {
      console.error(
        "Search service response:",
        error.response.data
      );
    }

    return res.status(500).json({
      success: false,
      message: "Scholarship search failed",
      error: error.message,
    });
  }
});

module.exports = router;