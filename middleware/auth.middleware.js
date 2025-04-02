const studentModel = require("../models/student.model");
const instructorModel = require("../models/instructor.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blackListTokenModel = require("../models/blackListToken.model.js");

module.exports.studentAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Token expired,please log in again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await studentModel.findById(decoded._id);
    if (!student) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = student;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports.instructorAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Token expired,please log in again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const instructor = await instructorModel.findById(decoded._id);
    if (!instructor) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = instructor;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};
