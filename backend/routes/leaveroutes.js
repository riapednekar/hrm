const express = require('express');
const Leave = require('../models/leave');
const LeaveBalance = require('../models/LeaveBalance');
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

// 1. Get Leave Balance
router.get('/balance', verifyToken, async (req, res) => {
    try {
        let balance = await LeaveBalance.findOne({ userId: req.user.id });
        if (!balance) {
            balance = await LeaveBalance.create({ userId: req.user.id });
        }
        res.json(balance);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get leave balance', error: err.message });
    }
});

// 2. Apply for leave (Employee/User)
router.post('/apply', verifyToken, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason, remarks } = req.body;
        const leaveReason = reason || remarks || 'Personal Leave';

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
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
            reason: leaveReason,
            days,
            status: 'Pending',
        });

        await newLeave.save();
        res.status(201).json({
            message: 'Leave request submitted successfully!',
            leave: newLeave,
            request: newLeave,
            leaveRequest: newLeave
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Get logged-in user's leave requests
const handleGetMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.get('/my-leaves', verifyToken, handleGetMyLeaves);
router.get('/my-requests', verifyToken, handleGetMyLeaves);

// 4. Admin: Get all leave requests
const handleGetAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('user', 'firstName lastName email loginId department designation role')
            .sort({ createdAt: -1 });

        const normalized = leaves.map((l) => {
            const u = l.user || {};
            return {
                ...l.toObject(),
                name: l.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Employee',
                loginId: l.loginId || u.loginId || '',
                department: u.department || 'General',
                designation: u.designation || 'Associate',
                remarks: l.reason || l.remarks || '',
                daysCount: l.days,
                userId: u,
            };
        });

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.get('/all', verifyToken, verifyAdmin, handleGetAllLeaves);
router.get('/admin/all', verifyToken, verifyAdmin, handleGetAllLeaves);

// 5. Admin: Update leave status (Approve / Reject)
const handleUpdateLeaveStatus = async (req, res) => {
    try {
        const { status, reviewNote, adminComments } = req.body;
        const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';

        if (!['Approved', 'Rejected', 'Pending'].includes(normalizedStatus)) {
            return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        leave.status = normalizedStatus;
        leave.reviewedBy = `${req.user.loginId || 'Admin'}`;
        if (reviewNote || adminComments) {
            leave.reviewNote = reviewNote || adminComments;
        }

        await leave.save();
        res.json({
            message: `Leave request marked as ${normalizedStatus}!`,
            leave,
            request: leave,
            leaveRequest: leave
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

router.put('/:id/status', verifyToken, verifyAdmin, handleUpdateLeaveStatus);
router.patch('/admin/:id/status', verifyToken, verifyAdmin, handleUpdateLeaveStatus);
router.put('/admin/:id/status', verifyToken, verifyAdmin, handleUpdateLeaveStatus);

module.exports = router;
