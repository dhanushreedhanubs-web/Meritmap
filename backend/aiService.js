function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function sameValue(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

function explainCriteria(student, scholarship) {
  const requirementsMet = [];
  const missingInformation = [];
  const criteriaNotMet = [];

  // State
  if (hasValue(scholarship.state)) {
    if (!hasValue(student.state)) {
      missingInformation.push("Student state");
    } else if (sameValue(student.state, scholarship.state)) {
      requirementsMet.push("state");
    } else {
      criteriaNotMet.push("state");
    }
  }

  // Course
  const courses = Array.isArray(scholarship.courses)
    ? scholarship.courses
    : hasValue(scholarship.course)
      ? [scholarship.course]
      : [];

  if (courses.length > 0) {
    if (!hasValue(student.course)) {
      missingInformation.push("Student course");
    } else if (
      courses.some(course => sameValue(student.course, course))
    ) {
      requirementsMet.push("course");
    } else {
      criteriaNotMet.push("course");
    }
  }

  // Category
  if (
    Array.isArray(scholarship.categories) &&
    scholarship.categories.length > 0
  ) {
    if (!hasValue(student.category)) {
      missingInformation.push("Student category");
    } else if (
      scholarship.categories.some(category =>
        sameValue(student.category, category)
      )
    ) {
      requirementsMet.push("category");
    } else {
      criteriaNotMet.push("category");
    }
  }

  // Income limit
  if (hasValue(scholarship.incomeLimit)) {
    const income = Number(student.income);
    const limit = Number(scholarship.incomeLimit);

    if (!hasValue(student.income) || !Number.isFinite(income)) {
      missingInformation.push("Student income");
    } else if (!Number.isFinite(limit)) {
      missingInformation.push("Verified scholarship income limit");
    } else if (income <= limit) {
      requirementsMet.push("income");
    } else {
      criteriaNotMet.push("income");
    }
  }

  // Minimum marks
  if (
    scholarship.minimumMarksRequired === true &&
    hasValue(scholarship.minimumMarks)
  ) {
    const marks = Number(student.marks);
    const minimum = Number(scholarship.minimumMarks);

    if (!hasValue(student.marks) || !Number.isFinite(marks)) {
      missingInformation.push("Student marks");
    } else if (!Number.isFinite(minimum)) {
      missingInformation.push("Verified minimum marks requirement");
    } else if (marks >= minimum) {
      requirementsMet.push("minimum marks");
    } else {
      criteriaNotMet.push("minimum marks");
    }
  }

  // Age
  if (scholarship.ageRequired === true) {
    if (!hasValue(student.age)) {
      missingInformation.push("Student age");
    } else {
      const age = Number(student.age);
      const minAge = hasValue(scholarship.minAge)
        ? Number(scholarship.minAge)
        : null;
      const maxAge = hasValue(scholarship.maxAge)
        ? Number(scholarship.maxAge)
        : null;

      if (!Number.isFinite(age)) {
        missingInformation.push("Valid student age");
      } else if (
        (minAge !== null && !Number.isFinite(minAge)) ||
        (maxAge !== null && !Number.isFinite(maxAge))
      ) {
        missingInformation.push("Verified scholarship age criteria");
      } else if (
        minAge === null &&
        maxAge === null
      ) {
        missingInformation.push("Scholarship age criteria");
      } else if (
        (minAge !== null && age < minAge) ||
        (maxAge !== null && age > maxAge)
      ) {
        criteriaNotMet.push("age");
      } else {
        requirementsMet.push("age");
      }
    }
  }

  // Gender
  if (
    scholarship.genderRequired === true &&
    Array.isArray(scholarship.genders) &&
    scholarship.genders.length > 0
  ) {
    if (!hasValue(student.gender)) {
      missingInformation.push("Student gender");
    } else if (
      scholarship.genders.some(gender =>
        sameValue(student.gender, gender)
      )
    ) {
      requirementsMet.push("gender");
    } else {
      criteriaNotMet.push("gender");
    }
  }

  // Disability
  if (scholarship.disabilityRequired === true) {
    if (typeof student.disability !== "boolean") {
      missingInformation.push("Student disability information");
    } else if (student.disability === true) {
      requirementsMet.push("disability");
    } else {
      criteriaNotMet.push("disability");
    }
  }

  return {
    requirementsMet,
    missingInformation,
    criteriaNotMet,
  };
}

function buildExplanation(eligibilityResult, criteria) {
  const status = eligibilityResult.status || "Needs Verification";
  const reasons = Array.isArray(eligibilityResult.reasons)
    ? eligibilityResult.reasons
    : [];

  const parts = [];

  if (eligibilityResult.eligible === true) {
    parts.push(
      "According to the backend eligibility check, the student is eligible for this scholarship."
    );
  } else if (eligibilityResult.eligible === false) {
    parts.push(
      "According to the backend eligibility check, the student is not currently marked as eligible for this scholarship."
    );
  } else {
    parts.push(
      "The backend eligibility result is inconclusive. Please verify the scholarship requirements and student information."
    );
  }

  parts.push(`Eligibility status: ${status}.`);

  if (criteria.requirementsMet.length > 0) {
    parts.push(
      `Requirements matched: ${criteria.requirementsMet.join(", ")}.`
    );
  }

  if (criteria.criteriaNotMet.length > 0) {
    parts.push(
      `Criteria not met: ${criteria.criteriaNotMet.join(", ")}.`
    );
  }

  if (criteria.missingInformation.length > 0) {
    parts.push(
      `Information needing verification: ${criteria.missingInformation.join(", ")}.`
    );
  }

  if (reasons.length > 0) {
    parts.push(`Backend notes: ${reasons.join("; ")}.`);
  }

  return parts.join(" ");
}

 async function explainEligibility({
  student,
  scholarship,
  eligibilityResult,
}) {
  if (!student || !scholarship || !eligibilityResult) {
    throw new Error(
      "student, scholarship, and eligibilityResult are required"
    );
  }

  console.log("UPDATED aiService.js IS RUNNING");

  // JavaScript, not the AI model, determines the criteria lists.
  
const criteria = explainCriteria(student, scholarship);

// Include verification requirements reported by the authoritative checker.
const reasons = Array.isArray(eligibilityResult.reasons)
  ? eligibilityResult.reasons
  : [];

  const verificationMap = [
  ["Student family income needs verification", "Student income"],
  ["Scholarship income limit needs verification", "Scholarship income limit"],
  ["Student academic marks need verification", "Student marks"],
  ["Scholarship minimum marks requirement needs verification", "Scholarship minimum marks requirement"],
  ["Gender information needs verification", "Student gender"],
  ["Age information needs verification", "Student age"],
  ["Disability information needs verification", "Student disability information"],
];

for (const [reason, field] of verificationMap) {
  if (
    reasons.some((item) =>
      item.toLowerCase().includes(reason.toLowerCase())
    ) &&
    !criteria.missingInformation.includes(field)
  ) {
    criteria.missingInformation.push(field);
    console.log("MISSING INFORMATION ADDED:", criteria.missingInformation);
  }
}

  // Build a reliable explanation directly from the authoritative result.
  const explanation = buildExplanation(eligibilityResult, criteria);
  console.log("DETERMINISTIC EXPLANATION FUNCTION CALLED");

  const applicationLink = scholarship.applicationLink;

  const nextSteps = [];

 
if (criteria.missingInformation.length > 0) {
  const scholarshipInfoMissing = criteria.missingInformation.some(
    (item) =>
      item.toLowerCase().includes("scholarship") ||
      item.toLowerCase().includes("requirement")
  );

  const studentInfoMissing = criteria.missingInformation.some(
    (item) =>
      !item.toLowerCase().includes("scholarship") &&
      !item.toLowerCase().includes("requirement")
  );

  if (scholarshipInfoMissing) {
    nextSteps.push(
      "Verify the missing scholarship requirements using the official scholarship guidelines."
    );
  }

  if (studentInfoMissing) {
    nextSteps.push(
      "Provide or verify the missing student information."
    );
  }
}

if (criteria.criteriaNotMet.length > 0) {
  nextSteps.push(
    "Review the criteria that do not match your profile before applying."
  );
}

if (
  eligibilityResult.eligible === true &&
  hasValue(applicationLink)
) {
  nextSteps.push(`Apply using the provided link: ${applicationLink}`);
} else if (
  eligibilityResult.eligible !== true &&
  hasValue(applicationLink)
) {
  nextSteps.push(
    `Review the official scholarship details: ${applicationLink}`
  );
}


  return {
    explanation,
    requirementsMet: criteria.requirementsMet,
    missingInformation: criteria.missingInformation,
    nextSteps,
  };
}

module.exports = { explainEligibility };