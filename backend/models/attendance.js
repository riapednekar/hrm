const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        loginId: {
            type: String
        },
        name: {
            type: String
        },
        companyName: {
            type: String
        },
        date: {
            type: String,
            required: true,
            index: true
        },
        checkIn: {
            type: Date,
            default: null
        },
        checkInTime: {
            type: Date,
            default: null
        },
        checkOut: {
            type: Date,
            default: null
        },
        checkOutTime: {
            type: Date,
            default: null
        },
        workHours: {
            type: Number,
            default: 0
        },
        totalHours: {
            type: Number,
            default: 0
        },
        extraHours: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: 'present'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
