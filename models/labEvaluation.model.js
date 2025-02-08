const mongoose = require('mongoose');


// changes to be made
const labEvaluationSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    submissions: [{
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        marks: Number,
        feedback: String,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LabEvaluation', labEvaluationSchema); 