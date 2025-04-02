const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (email) {
          // Simple email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid email format",
      },
    },
    batchId: {
      type: String,
      required: true,
    },
    backCoursesBatchId: {
      type: [String], // We should consider this as an array to support backCourses
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    backCourses: {
      type: [String], // Array of strings representing back courses
      default: [],
    },
    courseCodes: {
      type: [String], // Array of strings representing enrolled course codes
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("Student", studentSchema);
