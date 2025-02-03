const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { validateThaparEmail } = require('../utils/validator');

// Register user
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate Thapar email
        if (!validateThaparEmail(email)) {
            return next(new ErrorHandler('Please use your Thapar Institute email address', 400));
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return next(new ErrorHandler('Email already registered', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Generate OTP
        const otp = user.generateVerificationOTP();
        await user.save();

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - Thapar Virtual Labs',
            message: `Your verification OTP is: ${otp}\nThis OTP is valid for 10 minutes.`
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for verification OTP.'
        });
    } catch (error) {
        next(error);
    }
});

// Verify email with OTP
router.post('/verify-email', async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if OTP exists and is valid
        if (!user.otp || !user.otp.code || !user.otp.expiry) {
            return next(new ErrorHandler('OTP has expired. Please request a new one', 400));
        }

        // Check if OTP has expired
        if (Date.now() > user.otp.expiry) {
            return next(new ErrorHandler('OTP has expired. Please request a new one', 400));
        }

        // Verify OTP
        if (user.otp.code !== otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }

        // Mark email as verified and remove OTP
        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
});

// Resend verification OTP
router.post('/resend-otp', async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (user.isEmailVerified) {
            return next(new ErrorHandler('Email already verified', 400));
        }

        // Generate new OTP
        const otp = user.generateVerificationOTP();
        await user.save();

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - Thapar Virtual Labs',
            message: `Your new verification OTP is: ${otp}\nThis OTP is valid for 10 minutes.`
        });

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Login user
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate Thapar email
        if (!validateThaparEmail(email)) {
            return next(new ErrorHandler('Please use your Thapar Institute email address', 400));
        }

        if (!email || !password) {
            return next(new ErrorHandler('Please enter email & password', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return next(new ErrorHandler('Please verify your email before logging in', 401));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
});

// Forgot password
router.post('/password/forgot', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler('User not found with this email', 404));
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set to resetPasswordToken
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expire time
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create reset password url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

        await sendEmail({
            email: user.email,
            subject: 'Thapar Virtual Labs Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 