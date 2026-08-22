const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginId: { type: String, required: true },
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, enum: ['present', 'checked_out', 'absent', 'half_day'], default: 'present' },
    totalHours: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
