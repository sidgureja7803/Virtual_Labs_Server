const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  coordinatorEmail: {
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
});

module.exports = mongoose.model("Course", courseSchema);
