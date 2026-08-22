const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        leaveType: {
            type: String,
            enum: ['Paid Time Off', 'Sick Leave', 'Unpaid Leave'],
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        daysCount: {
            type: Number,
            required: true,
        },

        remarks: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
            index: true,
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        adminComments: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);