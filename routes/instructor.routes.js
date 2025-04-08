const instructor = require("../models/instructor.model.js");
const Assignment = require("../models/assignment.model.js");
const batchMapping = require("../models/batchMapping.model.js");
const LabReport = require("../models/labReport.model.js");
const attendanceServices = require("../services/attendance.services.js");
const Course = require("../models/course.model.js");
const Student = require("../models/student.model.js");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const blackListTokenModel = require("../models/blackListToken.model.js");

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the instructor exists
  const instructorData = await instructor
    .findOne({ email })
    .select("+password");

  if (!instructorData) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await instructor.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = instructor.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, instructorData });
});

//logout 
router.post("/logout", async (req, res) => {
  const token = req.cookies.token;

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
});


//get instructor labs
router.get(
  "/getlabs/:emailID",
  authMiddleware.instructorAuth,
  async (req, res) => {
    try {
      const instructorData = await batchMapping.findMany({
        instructorEmail: req.params.emailID,
      });
      // find the arry of the batches associated with the instructor
      if (!instructorData) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      res.status(200).json(instructorData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//get assignment details for batch
router.get(
  "/getreport/:courseCode/:batchId/:assignNo",
  authMiddleware.instructorAuth,
  async (req, res) => {
    try {
      const assignmentData = await LabReport.find({
        courseCode: req.params.courseCode,
        batchId: req.params.batchId,
        assignmentNo: req.params.assignNo,
      });

      if (!assignmentData) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.status(200).json(assignmentData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//get all assignments for a course
router.get(
  "/subject/getassignments/:courseCode",
  authMiddleware.instructorAuth,
  async (req, res) => {
    try {
      const assignmentData = await Assignment.find({
        courseCode: req.params.courseCode,
      });

      if (!assignmentData) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.status(200).json(assignmentData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//take attendance
// used for getting the students of the batch
router.get(
  "/takeAttendance/:courseCode/:batchId",
  authMiddleware.instructorAuth,
  async (req, res) => {
    try {
      const studentData = await Student.find({ batchId: req.params.batchId });

      if (!studentData) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(studentData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//submit attendance
router.post(
  "/submitAttendance",
  authMiddleware.instructorAuth,
  async (req, res) => {
    try {
      const attendanceData = req.body;
      const attendance = await attendanceServices.createAttendance(
        attendanceData
      );

      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
