const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Department = require('../models/Department');
const ErrorHandler = require('../utils/errorHandler');

// Create new department - Teacher only
router.post(
    '/',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            const department = await Department.create(req.body);
            res.status(201).json({
                success: true,
                department
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get all departments
router.get('/', async (req, res, next) => {
    try {
        const departments = await Department.find();
        res.status(200).json({
            success: true,
            departments
        });
    } catch (error) {
        next(error);
    }
});

// Get single department
router.get('/:id', async (req, res, next) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return next(new ErrorHandler('Department not found', 404));
        }
        res.status(200).json({
            success: true,
            department
        });
    } catch (error) {
        next(error);
    }
});

// Update department - Teacher only
router.put(
    '/:id',
    isAuthenticatedUser,
    authorizeRoles('teacher'),
    async (req, res, next) => {
        try {
            let department = await Department.findById(req.params.id);
            if (!department) {
                return next(new ErrorHandler('Department not found', 404));
            }

            department = await Department.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                success: true,
                department
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 