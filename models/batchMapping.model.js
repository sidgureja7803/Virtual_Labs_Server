const mongoose = require("mongoose");

const batchMappingSchema = new mongoose.Schema({
  instructorEmail: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (email) {
        // Simple email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email format",
    },
  },
  courseCode: {
    type: String,
    required: true,
    trim: true,
  },
  batchId: {
    type: String, 
    required: true,
  },
  schedule: {
    type:String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  }
});

module.exports = mongoose.model("BatchMapping", batchMappingSchema);
