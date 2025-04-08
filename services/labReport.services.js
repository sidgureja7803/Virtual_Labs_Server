const labReportModel = require("../models/labReport.model");

module.exports.createLabReport = async({
    courseCode,
    batchId,
    assignmentNo,
    studentEmail,
    reportLink,
    }) => {
    try {
        const labReport = new labReportModel({
        courseCode,
        batchId,
        assignmentNo,
        studentEmail,
        reportLink,
        });
        await labReport.save();
        return labReport;
    } catch (error) {
        throw new Error("Error creating lab report: " + error.message);
    }
};
