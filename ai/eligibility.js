function checkEligibility(student, scholarship) {
  const reasons = [];
  let passed = 0;
  let failed = 0;
  let hardFailure = false;
  let needsVerification = false;
  // State
  if (student.state === scholarship.state) {
    passed++;
    reasons.push("State matches");
  } else {
    failed++;
    reasons.push("State does not match");
  }

  // Course
  if (scholarship.courses.includes(student.course)) {
    passed++;
    reasons.push("Course matches");
  } else {
    failed++;
    reasons.push("Course does not match");
  }

  // Income
  
  // Income
  if (
    typeof student.income !== "number" ||
    typeof scholarship.incomeLimit !== "number"
  ) {
    reasons.push("Family income needs verification");
    needsVerification = true;
  } else if (student.income <= scholarship.incomeLimit) {
    passed++;
    reasons.push("Income is within the limit");
  } else {
    failed++;
    hardFailure = true;
    reasons.push("Family income exceeds the limit");
  }
  

  
  
  // Marks
  if (
    typeof student.marks !== "number" ||
    typeof scholarship.minimumMarks !== "number"
  ) {
    reasons.push("Academic marks need verification");
    needsVerification = true;

  } else if (student.marks >= scholarship.minimumMarks) {
    passed++;
    reasons.push("Academic requirement is satisfied");
  } else {
    failed++;
    reasons.push("Academic marks are below the requirement");

    if (scholarship.minimumMarksRequired === true) {
      hardFailure = true;
    }
  }


  // Category
  if (
    !scholarship.categories ||
    scholarship.categories.includes(student.category)
  ) {
    passed++;
    reasons.push("Category matches");
  } else {
    failed++;
    reasons.push("Category does not match");
  }
// Age
if (scholarship.minAge && student.age < scholarship.minAge) {
  failed++;
  reasons.push("Age is below the minimum requirement");

  if (scholarship.ageRequired === true) {
    hardFailure = true;
  }
} else if (scholarship.maxAge && student.age > scholarship.maxAge) {
  failed++;
  reasons.push("Age exceeds the maximum requirement");

  if (scholarship.ageRequired === true) {
    hardFailure = true;
  } else {
    reasons.push("Age requirement is not mandatory");
  }
} else {
  passed++;
  reasons.push("Age requirement is satisfied");
}

// Gender
if (scholarship.genders) {
  if (scholarship.genders.includes(student.gender)) {
    passed++;
    reasons.push("Gender matches");
  } else {
    failed++;
    reasons.push("Gender does not match");

    if (scholarship.genderRequired === true) {
      hardFailure = true;
    }
  }
}

// Disability
if (scholarship.disabilityRequired === true) {
  if (student.disability === true) {
    passed++;
    reasons.push("Disability requirement is satisfied");
  } else {
    failed++;
    hardFailure = true;
    reasons.push("Disability requirement is not satisfied");
  }
}
  // Calculate score
  const totalChecks = passed + failed;
  const matchScore = Math.round((passed / totalChecks) * 100);

  // Determine status
  // Determine status

let status;

if (hardFailure) {
  status = "Not Eligible";
} else if (needsVerification) {
  status = "Needs Verification";
} else if (failed === 0) {
  status = "Eligible";
} else if (failed <= 1) {
  status = "Maybe Eligible";
} else {
  status = "Not Eligible";
}
  return {
    eligible: status === "Eligible",
    status,
    matchScore,
    reasons
  };
}

module.exports = checkEligibility;
