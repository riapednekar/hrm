const Attendance = require('../models/Attendance');

// Helper to get current date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

// Check-in (Employee)
exports.checkIn = async (req, res) => {
    try {
        const today = getTodayDate();
        const existingRecord = await Attendance.findOne({ userId: req.user.id, date: today });

        if (existingRecord) {
            return res.status(400).json({
                message: 'Already checked in for today',
                attendance: existingRecord
            });
        }

        const newRecord = new Attendance({
            userId: req.user.id,
            date: today,
            checkIn: new Date(),
            status: 'Present',
            workHours: 0,
            extraHours: 0
        });

        await newRecord.save();

        res.status(201).json({
            message: 'Check-in successful',
            attendance: newRecord
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during check-in',
            error: error.message
        });
    }
};

// Check-out (Employee)
exports.checkOut = async (req, res) => {
    try {
        const today = getTodayDate();
        const record = await Attendance.findOne({ userId: req.user.id, date: today });

        if (!record || !record.checkIn) {
            return res.status(400).json({
                message: 'No check-in record found for today'
            });
        }

        if (record.checkOut) {
            return res.status(400).json({
                message: 'Already checked out for today',
                attendance: record
            });
        }

        const checkOutTime = new Date();
        record.checkOut = checkOutTime;

        // Calculate worked hours (difference in milliseconds converted to hours)
        const checkInTime = new Date(record.checkIn);
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        record.workHours = hours;

        // Calculate extra hours (overtime beyond standard 8-hour workday)
        record.extraHours = parseFloat(Math.max(0, hours - 8).toFixed(2));

        // If work hours are less than 4, mark as Half-day, otherwise Present
        if (hours < 4) {
            record.status = 'Half-day';
        } else {
            record.status = 'Present';
        }

        await record.save();

        res.status(200).json({
            message: 'Check-out successful',
            attendance: record
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during check-out',
            error: error.message
        });
    }
};

// Get today's attendance status (Employee)
exports.getTodayStatus = async (req, res) => {
    try {
        const today = getTodayDate();
        const record = await Attendance.findOne({ userId: req.user.id, date: today });

        if (!record) {
            return res.status(200).json({
                checkedIn: false,
                checkedOut: false,
                message: 'No attendance record for today',
                attendance: null
            });
        }

        res.status(200).json({
            checkedIn: true,
            checkedOut: Boolean(record.checkOut),
            attendance: record
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error fetching today status',
            error: error.message
        });
    }
};

// Get personal attendance history (Employee)
exports.getMyHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { userId: req.user.id };

        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.date = { $gte: startDate };
        } else if (endDate) {
            query.date = { $lte: endDate };
        }

        const history = await Attendance.find(query).sort({ date: -1, createdAt: -1 });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({
            message: 'Server error fetching attendance history',
            error: error.message
        });
    }
};

// Get all attendance records (Admin only)
exports.getAllAttendanceAdmin = async (req, res) => {
    try {
        const { date } = req.query;
        const query = {};

        if (date) {
            query.date = date;
        }

        const records = await Attendance.find(query)
            .populate('userId', 'firstName lastName employeeId department designation')
            .sort({ date: -1, createdAt: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({
            message: 'Server error fetching employee attendance records',
            error: error.message
        });
    }
};
