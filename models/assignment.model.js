const mongoose = require("mongoose");


// This is not correct
const assignmentSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [String], // Array of strings representing assignment names or IDs
      required: true,
    },
    assignmentNo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
