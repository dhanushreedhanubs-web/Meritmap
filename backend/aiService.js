
function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function sameValue(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

function explainCriteria(student, scholarship) {
  const requirementsMet = [];
  const missingInformation = [];

  function check(label, studentValue, scholarshipValue, matches) {
    if (!hasValue(studentValue)) {
      missingInformation.push(`Student ${label}`);
      return;
    }

    if (!hasValue(scholarshipValue)) {
      missingInformation.push(`Scholarship ${label} criteria`);
      return;
    }

    if (matches) {
      requirementsMet.push(label);
    }
  }

  // State
  if (hasValue(scholarship.state)) {
    check(
      "state",
      student.state,
      scholarship.state,
      sameValue(student.state, scholarship.state)
    );
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
    } else if (courses.some(course => sameValue(student.course, course))) {
      requirementsMet.push("course");
    }
  }

  // Category
  if (Array.isArray(scholarship.categories) &&
      scholarship.categories.length > 0) {
    if (!hasValue(student.category)) {
      missingInformation.push("Student category");
    } else if (
      scholarship.categories.some(category =>
        sameValue(student.category, category)
      )
    ) {
      requirementsMet.push("category");
    }
  }

  // Income limit: lower income must be at or below the limit
  if (hasValue(scholarship.incomeLimit)) {
    const income = Number(student.income);
    const limit = Number(scholarship.incomeLimit);

    if (!hasValue(student.income) || !Number.isFinite(income)) {
      missingInformation.push("Student income");
    } else if (Number.isFinite(limit) && income <= limit) {
      requirementsMet.push("income");
    }
  }

  // Minimum marks, only when explicitly required
  if (
    scholarship.minimumMarksRequired === true &&
    hasValue(scholarship.minimumMarks)
  ) {
    const marks = Number(student.marks);
    const minimum = Number(scholarship.minimumMarks);

    if (!hasValue(student.marks) || !Number.isFinite(marks)) {
      missingInformation.push("Student marks");
    } else if (Number.isFinite(minimum) && marks >= minimum) {
      requirementsMet.push("minimum marks");
    }
  }

  // Age, only when explicitly required
  if (scholarship.ageRequired === true) {
    if (!hasValue(student.age)) {
      missingInformation.push("Student age");
    } else {
      const age = Number(student.age);
      const validMin = !hasValue(scholarship.minAge) ||
        age >= Number(scholarship.minAge);
      const validMax = !hasValue(scholarship.maxAge) ||
        age <= Number(scholarship.maxAge);

      if (
        Number.isFinite(age) &&
        (hasValue(scholarship.minAge) || hasValue(scholarship.maxAge)) &&
        validMin &&
        validMax
      ) {
        requirementsMet.push("age");
      }
    }
  }

  // Gender, only when explicitly required
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
    }
  }

  // Disability, only when explicitly required
  if (scholarship.disabilityRequired === true) {
    if (typeof student.disability !== "boolean") {
      missingInformation.push("Student disability information");
    } else if (student.disability === true) {
      requirementsMet.push("disability");
    }
  }

  return { requirementsMet, missingInformation };
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

  // JavaScript calculates these fields; Ollama only writes the explanation.
  const criteria = explainCriteria(student, scholarship);

  const prompt = `
You explain scholarship eligibility results in clear, simple language.

The backend eligibility decision is authoritative. Do not change or
contradict it. Do not independently decide eligibility.

Use only the supplied data. Do not invent facts, requirements, deadlines,
documents, benefits, or application instructions.

The pre-calculated requirementsMet and missingInformation lists are
authoritative. Do not add, remove, or change their items.

Return valid JSON with exactly these four keys:
{
  "explanation": "string",
  "requirementsMet": ["string"],
  "missingInformation": ["string"],
  "nextSteps": ["string"]
}

The explanation must accurately describe the backend decision and any
provided reasons. Do not claim every requirement is met if the backend
says otherwise. If reasons are empty, do not invent failed criteria.

Use the supplied application link for next steps only if one exists.
If there is no application link, use an empty nextSteps array.

STUDENT:
${JSON.stringify(student)}

SCHOLARSHIP:
${JSON.stringify(scholarship)}

AUTHORITATIVE ELIGIBILITY RESULT:
${JSON.stringify(eligibilityResult)}

PRE-CALCULATED REQUIREMENTS MET:
${JSON.stringify(criteria.requirementsMet)}

PRE-CALCULATED MISSING INFORMATION:
${JSON.stringify(criteria.missingInformation)}
`;

  let response;

  try {
    response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "scholarship-ai",
        prompt,
        stream: false,
        format: "json",
      }),
    });
  } catch (error) {
    throw new Error(
      `Could not connect to Ollama at localhost:11434: ${error.message}`
    );
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Ollama returned HTTP ${response.status}: ${details}`
    );
  }

  const data = await response.json();
  let result;

  try {
    result = JSON.parse(data.response);
  } catch {
    throw new Error("Ollama returned invalid JSON for the explanation");
  }

  if (typeof result.explanation !== "string") {
    throw new Error("Ollama returned an invalid explanation");
  }

  const applicationLink = scholarship.applicationLink;

  return {
    explanation:
  result.explanation.trim().length > 20 &&
  /[.!?]$/.test(result.explanation.trim())
    ? result.explanation.trim()
    : eligibilityResult.eligible === true
      ? "According to the backend eligibility check, the student is eligible for this scholarship."
      : eligibilityResult.eligible === false
        ? "According to the backend eligibility check, the student is not eligible for this scholarship."
        : "Please review the backend eligibility result for this scholarship.",
    requirementsMet: criteria.requirementsMet,
    missingInformation: criteria.missingInformation,
    nextSteps: hasValue(applicationLink)
      ? [`Apply using the provided link: ${applicationLink}`]
      : [],
  };
}

module.exports = { explainEligibility };
