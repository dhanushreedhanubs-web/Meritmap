
const checkEligibility = require("./eligibility");

const student = {
  state: "Karnataka",
  course: "Engineering",
  income: 180000,
  marks: 82,
  category: "SC",
  age: 20,
  gender: "Female",
  disability: true
};

const scholarship = {
  state: "Karnataka",
  courses: ["Engineering", "Medicine"],
  incomeLimit: 200000,
  minimumMarks: 60,
  minimumMarksRequired: true,
  categories: ["SC", "ST"],
  minAge: 18,
  maxAge: 25,
  ageRequired: true,
  genders: ["Female", "Male"],
  genderRequired: false,
  disabilityRequired: true
};

const tests = [
  {
    name: "All criteria match",
    student: {},
    expected: "Eligible"
  },
  {
    name: "Missing income",
    student: { income: undefined },
    expected: "Needs Verification"
  },
  {
    name: "Income exceeds limit",
    student: { income: 300000 },
    expected: "Not Eligible"
  },
  {
    name: "Missing age",
    student: { age: undefined },
    expected: "Needs Verification"
  },
  {
    name: "Age below minimum",
    student: { age: 16 },
    expected: "Not Eligible"
  },
  {
    name: "Category matches case-insensitively",
    student: { category: "sc" },
    expected: "Eligible"
  },
  {
    name: "Gender matches case-insensitively",
    student: { gender: "female" },
    expected: "Eligible"
  },
  {
    name: "Missing gender",
    student: { gender: undefined },
    expected: "Needs Verification"
  },
  {
    name: "Missing disability information",
    student: { disability: undefined },
    expected: "Needs Verification"
  },
  {
    name: "Mandatory disability requirement fails",
    student: { disability: false },
    expected: "Not Eligible"
  }
];

let passed = 0;

for (const test of tests) {
  const testStudent = { ...student, ...test.student };
  const result = checkEligibility(testStudent, scholarship);
  const success = result.status === test.expected;

  console.log(
    `${success ? "PASS" : "FAIL"}: ${test.name} — ` +
    `Expected ${test.expected}, got ${result.status}`
  );

  if (success) passed++;
}

console.log(`\n${passed}/${tests.length} tests passed.`);
process.exitCode = passed === tests.length ? 0 : 1;