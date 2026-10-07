const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number
    },
    state: {
      type: String
    },
    course: {
      type: String
    },
    year: {
      type: String
    },
    income: {
      type: Number
    },
    category: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);