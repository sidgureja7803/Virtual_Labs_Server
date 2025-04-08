const studentModel = require("../models/student.model");
const batchMappingModel = require("../models/batchMapping.model");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const labReportModel = require("../models/labReport.model");

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the instructor exists
  const studentData = await studentModel.findOne({ email }).select("+password");

  if (!instructorData) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatch = await studentModel.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = studentModel.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, studentData });
});

//logout
router.post("/logout", async (req, res) => {
  const token = req.cookies.token;

  await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
});
//get all subjects lab for students
router.get("/getlabs", authMiddleware.studentAuth, async (req, res) => {
  try {
    // Fetch the student data using the authenticated user's ID
    const studentData = await studentModel.findById(req.user._id);
    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch labs associated with the student's batchId
    const batchLabs = await batchMappingModel.find({
      batchId: studentData.batchId,
    });

    // Fetch back courses associated with the student's rollNo
    const backCourses = await backCoursesBatchMappingModel.find({
      rollNo: studentData.rollNo,
    });

    // Find the labs for each back course
    const backCoursesLabs = await Promise.all(
      backCourses.map(async (backCourse) => {
        return batchMappingModel.find({
          batchId: backCourse.batchId,
          courseCode: backCourse.courseCode,
        });
      })
    );

    // Flatten the array of arrays into a single array
    const flattenedBackCoursesLabs = backCoursesLabs.flat();

    // Combine the results
    const labs = {
      batchLabs,
      backCoursesLabs: flattenedBackCoursesLabs,
    };

    res.status(200).json({ success: true, labs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


//get lab assignments 
// router.get()


module.exports = router;
