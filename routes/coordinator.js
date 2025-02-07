const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const sendEmail = require('../utils/sendEmail');
const ErrorHandler = require('../utils/errorHandler');

// Assign Course Coordinator (Admin only)
router.post(
    '/assign-coordinator',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    async (req, res, next) => {
        try {
            const { courseId, coordinatorEmail } = req.body;

            const coordinator = await User.findOne({ email: coordinatorEmail });
            if (!coordinator) {
                return next(new ErrorHandler('User not found', 404));
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return next(new ErrorHandler('Course not found', 404));
            }

            // Update coordinator's role and courses
            coordinator.role = 'courseCoordinator';
            coordinator.coordinatedCourses.push(courseId);
            await coordinator.save();

            // Send email notification
            await sendEmail({
                email: coordinatorEmail,
                subject: 'Course Coordinator Assignment - Thapar Virtual Labs',
                message: `You have been assigned as the Course Coordinator for ${course.name}.`
            });

            res.status(200).json({
                success: true,
                message: 'Course Coordinator assigned successfully'
            });
        } catch (error) {
            next(error);
        }
    }
);

// Assign Lab Instructor (Course Coordinator only)
router.post(
    '/assign-instructor',
    isAuthenticatedUser,
    authorizeRoles('courseCoordinator'),
    async (req, res, next) => {
        try {
            const { courseId, instructorEmail, subgroups } = req.body;

            // Verify coordinator is assigned to this course
            if (!req.user.coordinatedCourses.includes(courseId)) {
                return next(new ErrorHandler('Not authorized for this course', 403));
            }

            const instructor = await User.findOne({ email: instructorEmail });
            if (!instructor) {
                return next(new ErrorHandler('User not found', 404));
            }

            // Generate unique codes for each subgroup
            const subgroupsWithCodes = subgroups.map(subgroup => ({
                name: subgroup,
                code: Math.random().toString(36).substring(2, 8).toUpperCase()
            }));

            // Update instructor's role and assigned subgroups
            instructor.role = 'labInstructor';
            instructor.assignedSubgroups.push({
                course: courseId,
                subgroups: subgroupsWithCodes
            });
            await instructor.save();

            // Send email notification
            await sendEmail({
                email: instructorEmail,
                subject: 'Lab Instructor Assignment - Thapar Virtual Labs',
                message: `You have been assigned as Lab Instructor for subgroups: ${subgroups.join(', ')}`
            });

            res.status(200).json({
                success: true,
                message: 'Lab Instructor assigned successfully'
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 