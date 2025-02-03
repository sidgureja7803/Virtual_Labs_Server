const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Experiment = require('../models/Experiment');
const ErrorHandler = require('../utils/errorHandler');

// Create new experiment - Teacher only
router.post(
    '/',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            req.body.createdBy = req.user.id;
            const experiment = await Experiment.create(req.body);
            res.status(201).json({
                success: true,
                experiment
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get all experiments by course
router.get('/course/:courseId', async (req, res, next) => {
    try {
        const experiments = await Experiment.find({ course: req.params.courseId })
            .populate('course', 'name courseCode')
            .populate('createdBy', 'name');

        res.status(200).json({
            success: true,
            experiments
        });
    } catch (error) {
        next(error);
    }
});

// Get single experiment
router.get('/:id', async (req, res, next) => {
    try {
        const experiment = await Experiment.findById(req.params.id)
            .populate('course', 'name courseCode')
            .populate('createdBy', 'name')
            .populate('feedback.user', 'name');

        if (!experiment) {
            return next(new ErrorHandler('Experiment not found', 404));
        }

        res.status(200).json({
            success: true,
            experiment
        });
    } catch (error) {
        next(error);
    }
});

// Add feedback to experiment - Student only
router.post(
    '/:id/feedback',
    isAuthenticatedUser,
    authorizeRoles('student'),
    async (req, res, next) => {
        try {
            const { rating, comment } = req.body;

            const experiment = await Experiment.findById(req.params.id);
            if (!experiment) {
                return next(new ErrorHandler('Experiment not found', 404));
            }

            const feedback = {
                user: req.user.id,
                rating,
                comment
            };

            experiment.feedback.push(feedback);
            await experiment.save();

            res.status(200).json({
                success: true,
                message: 'Feedback added successfully'
            });
        } catch (error) {
            next(error);
        }
    }
);

// Update experiment - Teacher only
router.put(
    '/:id',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            let experiment = await Experiment.findById(req.params.id);
            if (!experiment) {
                return next(new ErrorHandler('Experiment not found', 404));
            }

            // Check if the teacher is the creator of the experiment
            if (experiment.createdBy.toString() !== req.user.id) {
                return next(new ErrorHandler('You are not authorized to update this experiment', 403));
            }

            experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                success: true,
                experiment
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 