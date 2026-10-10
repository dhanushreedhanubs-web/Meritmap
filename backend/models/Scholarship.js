const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    provider: {
      type: String,
      trim: true
    },

    description: {
      type: String
    },

    eligibility: {
      type: String
    },

    deadline: {
      type: String
    },

    amount: {
      type: String
    },

    applicationLink: {
      type: String
    },

    source: {
      type: String
    },

    // Fields used by the AI eligibility checker
    state: {
      type: String
    },

    courses: {
      type: [String],
      default: []
    },

    incomeLimit: {
      type: Number
    },

    minimumMarks: {
      type: Number
    },

    minimumMarksRequired: {
      type: Boolean,
      default: false
    },

    categories: {
      type: [String],
      default: []
    },

    minAge: {
      type: Number
    },

    maxAge: {
      type: Number
    },

    ageRequired: {
      type: Boolean,
      default: false
    },

    genders: {
      type: [String],
      default: []
    },

    genderRequired: {
      type: Boolean,
      default: false
    },

    disabilityRequired: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);