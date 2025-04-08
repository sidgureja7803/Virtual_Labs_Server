const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    batchId: {
      type: String,
      required: true,
      trim: true,
    },
    present: {
      type: [String], // Array of strings representing roll numbers
      required: true,
    },
    date: {
      type: Date, // Using Date type for the attendance date
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
