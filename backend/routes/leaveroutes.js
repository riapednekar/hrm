const express = require('express');
const Leave = require('../models/leave');
const User = require('../models/user');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper to calculate days between dates
const calculateDays = (start, end) => {
    try {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return isNaN(diffDays) ? 1 : diffDays;
    } catch {
        return 1;
    }
};

// Apply for leave (Employee/User)
router.post('/apply', verifyToken, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Start date, end date, and reason are required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const days = calculateDays(startDate, endDate);

        const newLeave = new Leave({
            user: user._id,
            loginId: user.loginId,
            name: `${user.firstName} ${user.lastName}`,
            companyName: user.companyName,
            leaveType: leaveType || 'Casual',
            startDate,
            endDate,
            reason,
            days,
            status: 'Pending',
        });

        await newLeave.save();
        res.status(201).json({ message: 'Leave request submitted successfully!', leave: newLeave });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get logged-in user's leave requests
router.get('/my-leaves', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all leave requests
router.get('/all', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('user', 'firstName lastName email loginId department role')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update leave status (Approve / Reject)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status, reviewNote } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        leave.status = status;
        leave.reviewedBy = `${req.user.loginId || 'Admin'}`;
        if (reviewNote) leave.reviewNote = reviewNote;

        await leave.save();
        res.json({ message: `Leave request marked as ${status}!`, leave });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
