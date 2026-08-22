const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        paidTimeOff: {
            total: {
                type: Number,
                default: 15,
            },
            used: {
                type: Number,
                default: 0,
            },
            remaining: {
                type: Number,
                default: 15,
            },
        },
        sickLeave: {
            total: {
                type: Number,
                default: 10,
            },
            used: {
                type: Number,
                default: 0,
            },
            remaining: {
                type: Number,
                default: 10,
            },
        },
        unpaidLeave: {
            used: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
