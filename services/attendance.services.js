const attendanceModel = require("../models/attendance.model.js");

module.exports.createAttendance = async ({
  batchId,
  courseCode,
  date,
  present,
}) => {
  try {
    // Create a new attendance instance
    const newAttendance = new attendanceModel({
      batchId,
      courseCode,
      date,
      present,
    });

    // Save the attendance instance to the database
    const savedAttendance = await newAttendance.save();

    return {
      success: true,
      message: "Attendance created successfully",
      data: savedAttendance,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error creating attendance",
      error: error.message,
    };
  }
};
