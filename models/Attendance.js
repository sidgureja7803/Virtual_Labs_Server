const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    subgroup: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    students: [{
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema); 