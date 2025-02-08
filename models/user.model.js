const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// changes to be made

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@thapar\.edu$/, 'Please use your Thapar email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'courseCoordinator', 'labInstructor', 'student'],
        default: 'student'
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: String,
        expiry: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    coordinatedCourses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    }],
    assignedSubgroups: [{
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        },
        subgroups: [{
            name: String,
            code: String // Unique code for student enrollment
        }]
    }],
    enrolledSubgroups: [{
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        },
        subgroup: {
            type: String
        },
        instructor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }]
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);

    if (this.isModified('email')) {
        const emailDomain = this.email.split('@')[1];
        if (emailDomain !== 'thapar.edu') {
            throw new Error('Only Thapar Institute email addresses are allowed');
        }
    }
    next();
});

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

// Generate OTP and set expiry
userSchema.methods.generateVerificationOTP = function() {
    const otp = require('../utils/otpGenerator')();
    this.otp = {
        code: otp,
        expiry: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    };
    return otp;
};

module.exports = mongoose.model('User', userSchema); 