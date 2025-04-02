const mongoose = require('mongoose');

const BackCoursesBatchMappingSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true,
    },
    batchId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('BackCoursesBatchMapping', BackCoursesBatchMappingSchema);