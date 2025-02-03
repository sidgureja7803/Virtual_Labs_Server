const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Course = require('../models/Course');
const ErrorHandler = require('../utils/errorHandler');

// Create new course - Teacher only
router.post(
    '/',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            req.body.createdBy = req.user.id;
            const course = await Course.create(req.body);
            res.status(201).json({
                success: true,
                course
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get all courses
router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('department', 'name code')
            .populate('createdBy', 'name');
        
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        next(error);
    }
});

// Get courses by department
router.get('/department/:departmentId', async (req, res, next) => {
    try {
        const courses = await Course.find({ department: req.params.departmentId })
            .populate('department', 'name code')
            .populate('createdBy', 'name');

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        next(error);
    }
});

// Get single course
router.get('/:id', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('department', 'name code')
            .populate('createdBy', 'name');

        if (!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        next(error);
    }
});

// Update course - Teacher only
router.put(
    '/:id',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            let course = await Course.findById(req.params.id);
            if (!course) {
                return next(new ErrorHandler('Course not found', 404));
            }

            // Check if the teacher is the creator of the course
            if (course.createdBy.toString() !== req.user.id) {
                return next(new ErrorHandler('You are not authorized to update this course', 403));
            }

            course = await Course.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                success: true,
                course
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 