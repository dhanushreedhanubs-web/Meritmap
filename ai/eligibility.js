function checkEligibility(student, scholarship) {
  const reasons = [];
  let passed = 0;
  let failed = 0;
  let hardFailure = false;
  let needsVerification = false;
  let verificationCount = 0;
  
  // State
  if (
    typeof student.state !== "string" ||
    student.state.trim() === "" ||
    typeof scholarship.state !== "string" ||
    scholarship.state.trim() === ""
  ) {
    reasons.push("State information needs verification");
    needsVerification = true;
    verificationCount++;
  } else if (
    student.state.trim().toLowerCase() ===
    scholarship.state.trim().toLowerCase()
  ) {
    passed++;
    reasons.push("State matches");
  } else {
    failed++;
    reasons.push("State does not match");
  }

  
    

  // Course
  if (
    typeof student.course !== "string" ||
    student.course.trim() === "" ||
    !Array.isArray(scholarship.courses) ||
    scholarship.courses.length === 0
  ) {
    reasons.push("Course information needs verification");
    needsVerification = true;
    verificationCount++;
  } else if (
    scholarship.courses.some(
      course =>
        typeof course === "string" &&
        course.trim().toLowerCase() ===
          student.course.trim().toLowerCase()
    )
  ) {
    passed++;
    reasons.push("Course matches");
  } else {
    failed++;
    reasons.push("Course does not match");
  }

  // Income
  if (
    typeof student.income !== "number" ||
    !Number.isFinite(student.income) ||
    student.income < 0 ||
    typeof scholarship.incomeLimit !== "number" ||
    !Number.isFinite(scholarship.incomeLimit) ||
    scholarship.incomeLimit < 0
  ) {
    reasons.push("Family income needs verification");
    needsVerification = true;
    verificationCount++;
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
    !Number.isFinite(student.marks) ||
    student.marks < 0 ||
    student.marks > 100 ||
    typeof scholarship.minimumMarks !== "number" ||
    !Number.isFinite(scholarship.minimumMarks) ||
    scholarship.minimumMarks < 0 ||
    scholarship.minimumMarks > 100
  ) {
    reasons.push("Academic marks need verification");
    needsVerification = true;
    verificationCount++;
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

  // Category
  if (
    student.category === undefined ||
    student.category === null ||
    typeof student.category !== "string" ||
    student.category.trim() === "" ||
    (scholarship.categories !== undefined &&
      scholarship.categories !== null &&
      !Array.isArray(scholarship.categories))
  ) {
    reasons.push("Category information needs verification");
    needsVerification = true;
    verificationCount++;
  } else if (
    !scholarship.categories ||
    scholarship.categories.length === 0 ||
    scholarship.categories.some(
  category =>
    typeof category === "string" &&
    category.trim().toLowerCase() ===
      student.category.trim().toLowerCase()
)
  ) {
    passed++;
    reasons.push("Category matches");
  } else {
    failed++;
    reasons.push("Category does not match");
  }


  // Age
  const hasMinAge = scholarship.minAge != null;
  const hasMaxAge = scholarship.maxAge != null;
  const hasAgeRestriction = hasMinAge || hasMaxAge;

  if (
    (hasMinAge &&
      (typeof scholarship.minAge !== "number" ||
        !Number.isFinite(scholarship.minAge) ||
        scholarship.minAge < 0)) ||
    (hasMaxAge &&
      (typeof scholarship.maxAge !== "number" ||
        !Number.isFinite(scholarship.maxAge) ||
        scholarship.maxAge < 0)) ||
    (hasMinAge &&
      hasMaxAge &&
      typeof scholarship.minAge === "number" &&
      typeof scholarship.maxAge === "number" &&
      scholarship.minAge > scholarship.maxAge)
  ) {
    reasons.push("Scholarship age limits need verification");
    needsVerification = true;
    verificationCount++;
  } else if (!hasAgeRestriction) {
    passed++;
    reasons.push("No age restriction");
  } else if (
    typeof student.age !== "number" ||
    !Number.isFinite(student.age) ||
    student.age < 0
  ) {
    reasons.push("Age needs verification");
    needsVerification = true;
    verificationCount++;
  } else if (hasMinAge && student.age < scholarship.minAge) {
    failed++;
    reasons.push("Age is below the minimum requirement");

    if (scholarship.ageRequired === true) {
      hardFailure = true;
    }
  } else if (hasMaxAge && student.age > scholarship.maxAge) {
    failed++;
    reasons.push("Age exceeds the maximum requirement");

    if (scholarship.ageRequired === true) {
      hardFailure = true;
    }
  } else {
    passed++;
    reasons.push("Age requirement is satisfied");
  }
  
  // Gender
  if (
    student.gender === undefined ||
    student.gender === null ||
    typeof student.gender !== "string" ||
    student.gender.trim() === ""
  ) {
    reasons.push("Gender information needs verification");
    needsVerification = true;
    verificationCount++;
  } else if (
    scholarship.genders != null &&
    !Array.isArray(scholarship.genders)
  ) {
    reasons.push("Scholarship gender criteria need verification");
    needsVerification = true;
    verificationCount++;
  } else if (
    !scholarship.genders ||
    scholarship.genders.length === 0
  ) {
    passed++;
    reasons.push("Gender requirement is not restricted");
  } else if (
    scholarship.genders.some(
      gender =>
        typeof gender === "string" &&
        gender.trim().toLowerCase() ===
          student.gender.trim().toLowerCase()
    )
  ) {
    passed++;
    reasons.push("Gender matches");
  } else {
    failed++;
    reasons.push("Gender does not match");

    if (scholarship.genderRequired === true) {
      hardFailure = true;
    }
  }
  // Disability
  if (scholarship.disabilityRequired === true) {
    if (typeof student.disability !== "boolean") {
      reasons.push("Disability information needs verification");
      needsVerification = true;
      verificationCount++;
    } else if (student.disability === true) {
      passed++;
      reasons.push("Disability requirement is satisfied");
    } else {
      failed++;
      hardFailure = true;
      reasons.push("Disability requirement is not satisfied");
    }
  } else {
    passed++;
    reasons.push("No mandatory disability requirement");
  }

  // Calculate score
  
  // Calculate score
  const totalChecks = passed + failed + verificationCount;
  const matchScore =
    totalChecks === 0
      ? 0
      : Math.round((passed / totalChecks) * 100);
  
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
