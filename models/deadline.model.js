const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    assignmentNo: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: Date, // Using Date type for deadline
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Deadline", deadlineSchema);
