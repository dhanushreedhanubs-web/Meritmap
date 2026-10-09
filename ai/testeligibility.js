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
  minimumMarksRequired: false,
  categories: ["SC", "ST"],
  minAge: 18,
  maxAge: 25,
  ageRequired: true,
 
  genders: ["Female", "Male"],
  genderRequired: false,

  disabilityRequired: true
};

const result = checkEligibility(student, scholarship);

console.log(result);