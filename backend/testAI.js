
const { explainEligibility } = require("./aiService");

async function main() {
  const student = {
    state: "Karnataka",
    course: "Engineering",
    category: "SC",
    income: 180000,
    marks: 82,
    age: 20,
    gender: "Female",
    disability: true,
  };

  const scholarship = {
    title: "Example Scholarship",
    state: "Karnataka",
    courses: ["Engineering"],
    incomeLimit: 200000,
    minimumMarks: 60,
    minimumMarksRequired: true,
    categories: ["SC", "ST"],
    minAge: 18,
    maxAge: 25,
    ageRequired: true,
    genders: ["Female", "Male"],
    genderRequired: false,
    disabilityRequired: false,
    applicationLink: "https://example.com",
  };

  const eligibilityResult = {
    eligible: true,
    status: "Eligible",
    matchScore: 100,
    reasons: [],
  };

  const explanation = await explainEligibility({
    student,
    scholarship,
    eligibilityResult,
  });

  console.log(JSON.stringify(explanation, null, 2));
}

main().catch((error) => {
  console.error("AI test failed:", error.message);
  process.exitCode = 1;
});
