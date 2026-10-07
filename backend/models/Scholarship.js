const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    provider: {
      type: String
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
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);