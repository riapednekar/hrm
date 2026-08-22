const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getTodayStatus,
    getMyHistory,
    getAllAttendanceAdmin
} = require('../controllers/attendancecontroller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/user');

// Employee Routes (Requires valid JWT)
router.post('/check-in', verifyToken, checkIn);
router.post('/check-out', verifyToken, checkOut);
router.get('/status', verifyToken, getTodayStatus);
router.get('/my-history', verifyToken, getMyHistory);

// Compatibility toggle route
router.post('/toggle', verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const record = await Attendance.findOne({ userId: req.user.id, date: today });
        if (!record || !record.checkIn) {
            return checkIn(req, res);
        } else if (!record.checkOut) {
            return checkOut(req, res);
        } else {
            record.checkOut = null;
            record.status = 'Present';
            await record.save();
            return res.json({ message: 'Checked in again', attendance: record, isCheckedIn: true });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Routes (Requires valid JWT + Admin Role)
router.get('/admin/all', verifyToken, verifyAdmin, getAllAttendanceAdmin);
router.get('/all', verifyToken, verifyAdmin, getAllAttendanceAdmin);

module.exports = router;
