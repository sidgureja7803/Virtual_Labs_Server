const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true }, // CSED, ECED, etc.
  branch: { type: String, required: true }, // CSE, COE, etc.
  introduction: { type: String, required: true },
  experiments: [
    {
      title: String,
      description: String,
      procedure: String,
      simulation: String,
    },
  ],
  targetAudience: { type: String, required: true },
  referenceBooks: { type: String, required: true },
  feedback: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("course", courseSchema);
