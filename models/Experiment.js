const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter experiment title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter experiment description']
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    procedure: [{
        type: String,
        required: true
    }],
    matlabLink: {
        type: String,
        required: [true, 'Please provide MATLAB simulation link']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Experiment', experimentSchema); 