const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginId: { type: String, required: true },
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    leaveType: { type: String, enum: ['Casual', 'Sick', 'Annual', 'Unpaid'], default: 'Casual' },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    days: { type: Number, default: 1 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewedBy: { type: String, default: null },
    reviewNote: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
