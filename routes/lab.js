const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const User = require('../models/User');
const LabEvaluation = require('../models/LabEvaluation');
const Attendance = require('../models/Attendance');
const ErrorHandler = require('../utils/errorHandler');

// Join subgroup (Student only)
router.post(
    '/join-subgroup',
    isAuthenticatedUser,
    authorizeRoles('student'),
    async (req, res, next) => {
        try {
            const { code } = req.body;

            // Find instructor and subgroup by code
            const instructor = await User.findOne({
                'assignedSubgroups.subgroups.code': code
            });

            if (!instructor) {
                return next(new ErrorHandler('Invalid subgroup code', 404));
            }

            const subgroupInfo = instructor.assignedSubgroups.find(
                assignment => assignment.subgroups.some(sg => sg.code === code)
            );

            // Add student to subgroup
            req.user.enrolledSubgroups.push({
                course: subgroupInfo.course,
                subgroup: subgroupInfo.subgroups.find(sg => sg.code === code).name,
                instructor: instructor._id
            });
            await req.user.save();

            res.status(200).json({
                success: true,
                message: 'Successfully joined subgroup'
            });
        } catch (error) {
            next(error);
        }
    }
);

// Create lab evaluation (Lab Instructor only)
router.post(
    '/evaluation',
    isAuthenticatedUser,
    authorizeRoles('labInstructor'),
    async (req, res, next) => {
        try {
            const { courseId, subgroup, title, date, totalMarks } = req.body;

            const evaluation = await LabEvaluation.create({
                course: courseId,
                subgroup,
                instructor: req.user._id,
                title,
                date,
                totalMarks
            });

            res.status(201).json({
                success: true,
                evaluation
            });
        } catch (error) {
            next(error);
        }
    }
);

// Mark attendance (Lab Instructor only)
router.post(
    '/attendance',
    isAuthenticatedUser,
    authorizeRoles('labInstructor'),
    async (req, res, next) => {
        try {
            const { courseId, subgroup, date, attendanceData } = req.body;

            const attendance = await Attendance.create({
                course: courseId,
                subgroup,
                instructor: req.user._id,
                date,
                students: attendanceData
            });

            res.status(201).json({
                success: true,
                attendance
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get student's enrolled labs
router.get(
    '/my-labs',
    isAuthenticatedUser,
    authorizeRoles('student'),
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id)
                .populate({
                    path: 'enrolledSubgroups.course',
                    select: 'name courseCode'
                })
                .populate({
                    path: 'enrolledSubgroups.instructor',
                    select: 'name email'
                });

            res.status(200).json({
                success: true,
                labs: user.enrolledSubgroups
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 