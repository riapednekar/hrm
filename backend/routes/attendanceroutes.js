const express = require('express');
const Attendance = require('../models/attendance');
const User = require('../models/user');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper to get formatted today string (YYYY-MM-DD)
const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

// Toggle Check In / Check Out for today
router.post('/toggle', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let record = await Attendance.findOne({ user: userId, date: today });

        if (!record) {
            // First action today -> Check In
            record = new Attendance({
                user: userId,
                loginId: user.loginId,
                name: `${user.firstName} ${user.lastName}`,
                companyName: user.companyName,
                date: today,
                checkInTime: new Date(),
                status: 'present',
            });
            await record.save();
            return res.json({
                message: 'Checked In Successfully!',
                isCheckedIn: true,
                record
            });
        } else if (!record.checkOutTime) {
            // Already checked in -> Check Out
            const checkOut = new Date();
            record.checkOutTime = checkOut;
            record.status = 'checked_out';

            // Calculate total hours
            const diffMs = checkOut - new Date(record.checkInTime);
            record.totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

            await record.save();
            return res.json({
                message: 'Checked Out Successfully!',
                isCheckedIn: false,
                record
            });
        } else {
            // Re-check in on the same day (toggle back to present)
            record.checkOutTime = null;
            record.status = 'present';
            await record.save();
            return res.json({
                message: 'Checked In Again!',
                isCheckedIn: true,
                record
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get today's attendance status for logged-in user
router.get('/status', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const record = await Attendance.findOne({ user: req.user.id, date: today });
        const isCheckedIn = record && !record.checkOutTime;
        res.json({
            date: today,
            isCheckedIn: !!isCheckedIn,
            record: record || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get logged-in user's attendance history
router.get('/my-history', verifyToken, async (req, res) => {
    try {
        const history = await Attendance.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(30);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all attendance records (with optional date filter)
router.get('/all', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const query = {};
        if (req.query.date) {
            query.date = req.query.date;
        }
        const records = await Attendance.find(query)
            .populate('user', 'firstName lastName email loginId department role')
            .sort({ date: -1, createdAt: -1 })
            .limit(100);
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
