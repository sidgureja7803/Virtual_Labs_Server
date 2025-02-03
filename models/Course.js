const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter course name'],
        trim: true
    },
    courseCode: {
        type: String,
        required: [true, 'Please enter course code'],
        unique: true
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: true
    },
    introduction: {
        type: String,
        required: [true, 'Please enter course introduction']
    },
    objectives: [{
        type: String,
        required: true
    }],
    targetAudience: {
        type: String,
        required: [true, 'Please specify target audience']
    },
    referenceBooks: [{
        title: String,
        author: String,
        publication: String
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema); 