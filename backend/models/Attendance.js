const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        date: {
            type: String,
            required: true
        },
        checkIn: {
            type: Date,
            default: null
        },
        checkOut: {
            type: Date,
            default: null
        },
        workHours: {
            type: Number,
            default: 0
        },
        extraHours: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Half-day', 'Leave'],
            default: 'Present'
        }
    },
    { timestamps: true }
);

// Unique compound index to ensure one attendance record per employee per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
