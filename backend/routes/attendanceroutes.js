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

// 1. Toggle Check In / Check Out for today
router.post('/toggle', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let record = await Attendance.findOne({
            $or: [{ user: userId, date: today }, { userId: userId, date: today }]
        });

        if (!record) {
            // Check In
            record = new Attendance({
                user: userId,
                userId: userId,
                loginId: user.loginId,
                name: `${user.firstName} ${user.lastName}`,
                companyName: user.companyName,
                date: today,
                checkIn: new Date(),
                checkInTime: new Date(),
                status: 'present',
            });
            await record.save();
            return res.json({
                message: 'Checked In Successfully!',
                isCheckedIn: true,
                checkedIn: true,
                checkedOut: false,
                record,
                attendance: record
            });
        } else if (!record.checkOutTime && !record.checkOut) {
            // Check Out
            const checkOut = new Date();
            record.checkOut = checkOut;
            record.checkOutTime = checkOut;
            record.status = 'checked_out';

            const checkInTime = record.checkInTime || record.checkIn || checkOut;
            const diffMs = checkOut - new Date(checkInTime);
            const hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
            record.totalHours = hours;
            record.workHours = hours;
            record.extraHours = parseFloat(Math.max(0, hours - 8).toFixed(2));

            await record.save();
            return res.json({
                message: 'Checked Out Successfully!',
                isCheckedIn: false,
                checkedIn: true,
                checkedOut: true,
                record,
                attendance: record
            });
        } else {
            // Re-check in on the same day
            record.checkOut = null;
            record.checkOutTime = null;
            record.status = 'present';
            await record.save();
            return res.json({
                message: 'Checked In Again!',
                isCheckedIn: true,
                checkedIn: true,
                checkedOut: false,
                record,
                attendance: record
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Explicit Check-in (Employee)
router.post('/check-in', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const userId = req.user.id;
        const user = await User.findById(userId);

        let record = await Attendance.findOne({
            $or: [{ user: userId, date: today }, { userId: userId, date: today }]
        });

        if (record && (record.checkIn || record.checkInTime)) {
            return res.status(400).json({
                message: 'Already checked in for today',
                attendance: record,
                record
            });
        }

        record = new Attendance({
            user: userId,
            userId: userId,
            loginId: user?.loginId || '',
            name: user ? `${user.firstName} ${user.lastName}` : 'Employee',
            companyName: user?.companyName || 'Dayflow',
            date: today,
            checkIn: new Date(),
            checkInTime: new Date(),
            status: 'present',
        });
        await record.save();

        res.status(201).json({
            message: 'Check-in successful',
            attendance: record,
            record
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error during check-in', error: err.message });
    }
});

// 3. Explicit Check-out (Employee)
router.post('/check-out', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const userId = req.user.id;

        let record = await Attendance.findOne({
            $or: [{ user: userId, date: today }, { userId: userId, date: today }]
        });

        if (!record || (!record.checkIn && !record.checkInTime)) {
            return res.status(400).json({ message: 'No check-in record found for today' });
        }

        if (record.checkOut || record.checkOutTime) {
            return res.status(400).json({
                message: 'Already checked out for today',
                attendance: record,
                record
            });
        }

        const checkOutTime = new Date();
        record.checkOut = checkOutTime;
        record.checkOutTime = checkOutTime;
        record.status = 'checked_out';

        const checkInTime = new Date(record.checkInTime || record.checkIn);
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        record.workHours = hours;
        record.totalHours = hours;
        record.extraHours = parseFloat(Math.max(0, hours - 8).toFixed(2));

        await record.save();

        res.status(200).json({
            message: 'Check-out successful',
            attendance: record,
            record
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error during check-out', error: err.message });
    }
});

// 4. Get today's attendance status
router.get('/status', verifyToken, async (req, res) => {
    try {
        const today = getTodayStr();
        const userId = req.user.id;
        const record = await Attendance.findOne({
            $or: [{ user: userId, date: today }, { userId: userId, date: today }]
        });

        const isCheckedIn = record && (record.checkIn || record.checkInTime) && (!record.checkOut && !record.checkOutTime);
        const isCheckedOut = record && Boolean(record.checkOut || record.checkOutTime);

        res.json({
            date: today,
            isCheckedIn: !!isCheckedIn,
            checkedIn: Boolean(record && (record.checkIn || record.checkInTime)),
            checkedOut: isCheckedOut,
            record: record || null,
            attendance: record || null
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Get personal attendance history
router.get('/my-history', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user.id;
        const query = {
            $or: [{ user: userId }, { userId: userId }]
        };

        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.date = { $gte: startDate };
        } else if (endDate) {
            query.date = { $lte: endDate };
        }

        const history = await Attendance.find(query)
            .sort({ date: -1, createdAt: -1 })
            .limit(60);

        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Admin: Get all attendance records (with optional date query)
const handleGetAllAttendance = async (req, res) => {
    try {
        const query = {};
        if (req.query.date) {
            query.date = req.query.date;
        }
        const records = await Attendance.find(query)
            .populate('user', 'firstName lastName email loginId department designation role')
            .populate('userId', 'firstName lastName email loginId department designation role')
            .sort({ date: -1, createdAt: -1 })
            .limit(100);

        // Normalize populated records
        const normalized = records.map((r) => {
            const u = r.user || r.userId || {};
            return {
                ...r.toObject(),
                name: r.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Employee',
                loginId: r.loginId || u.loginId || '',
                user: u,
                userId: u,
            };
        });

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.get('/all', verifyToken, verifyAdmin, handleGetAllAttendance);
router.get('/admin/all', verifyToken, verifyAdmin, handleGetAllAttendance);

module.exports = router;
