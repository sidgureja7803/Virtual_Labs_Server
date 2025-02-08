const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'courseSchema',
        required: true
    },
    subgroup: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'userSchema',
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


// get a excel kind of attendance report
attendanceSchema.statics.getAttendanceSummary = async function (courseId, subgroup) {
    try {
        // Fetch all attendance records for the given course & subgroup, sorted by date
        const attendanceRecords = await this.find({ course: courseId, subgroup })
            .populate('students.student', 'name') // Populate student names
            .sort({ date: 1 });

        // Cumulative attendance tracker
        const studentAttendance = {};

        // Process attendance records
        attendanceRecords.forEach(record => {
            record.students.forEach(({ student, status }) => {
                if (!studentAttendance[student._id]) {
                    studentAttendance[student._id] = { name: student.name, present: 0, total: 0 };
                }
                studentAttendance[student._id].total += 1;
                if (status === 'present') {
                    studentAttendance[student._id].present += 1;
                }
            });
        });

        // Calculate cumulative attendance percentage for each student
        const cumulativeAttendance = Object.entries(studentAttendance).map(([id, data]) => ({
            studentId: id,
            name: data.name,
            present: data.present,
            total: data.total,
            attendancePercentage: ((data.present / data.total) * 100).toFixed(2) + '%'
        }));

        return { attendanceRecords, cumulativeAttendance };
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        throw error;
    }
};


module.exports = mongoose.model('Attendance', attendanceSchema); 