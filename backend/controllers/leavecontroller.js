const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const Attendance = require('../models/attendance');

// Helper to calculate calendar days inclusively between two dates
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference = end.getTime() - start.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
};

// GET /api/leaves/balance (Employee)
exports.getLeaveBalance = async (req, res) => {
    try {
        let balance = await LeaveBalance.findOne({ userId: req.user.id });

        // Automatically initialize leave balance if it does not exist
        if (!balance) {
            balance = await LeaveBalance.create({ userId: req.user.id });
        }

        res.status(200).json(balance);
    } catch (error) {
        console.error('Get Leave Balance Error:', error);
        res.status(500).json({ message: 'Failed to get leave balance', error: error.message });
    }
};

// POST /api/leaves/apply (Employee)
exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, remarks } = req.body;

        // Basic validation
        if (!leaveType || !startDate || !endDate || !remarks) {
            return res.status(400).json({
                message: 'Leave type, start date, end date, and remarks are required',
            });
        }

        if (!['Paid Time Off', 'Sick Leave', 'Unpaid Leave'].includes(leaveType)) {
            return res.status(400).json({
                message: 'Invalid leave type. Allowed: Paid Time Off, Sick Leave, Unpaid Leave',
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: 'Invalid start date or end date format',
            });
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (start > end) {
            return res.status(400).json({
                message: 'Start date cannot be after end date',
            });
        }

        const daysCount = calculateDays(start, end);

        // Format dates as YYYY-MM-DD for checking against Attendance string dates
        const startYear = start.getFullYear();
        const startMonth = String(start.getMonth() + 1).padStart(2, '0');
        const startDay = String(start.getDate()).padStart(2, '0');
        const startDateStr = `${startYear}-${startMonth}-${startDay}`;

        const endYear = end.getFullYear();
        const endMonth = String(end.getMonth() + 1).padStart(2, '0');
        const endDay = String(end.getDate()).padStart(2, '0');
        const endDateStr = `${endYear}-${endMonth}-${endDay}`;

        // Check if employee already marked attendance as Present or Half-day on any requested date
        const existingAttendance = await Attendance.find({
            userId: req.user.id,
            date: { $gte: startDateStr, $lte: endDateStr },
            status: { $in: ['Present', 'Half-day'] },
        });

        if (existingAttendance.length > 0) {
            return res.status(400).json({
                message: 'Cannot apply for leave on a day where attendance is already recorded',
                conflictingDates: existingAttendance.map((att) => att.date),
            });
        }

        // Check for overlapping Pending or Approved leave requests
        const overlappingLeave = await LeaveRequest.findOne({
            userId: req.user.id,
            status: { $in: ['Pending', 'Approved'] },
            startDate: { $lte: end },
            endDate: { $gte: start },
        });

        if (overlappingLeave) {
            return res.status(400).json({
                message: 'You already have a pending or approved leave request covering these dates',
            });
        }

        // Validate paid or sick leave balance
        if (leaveType !== 'Unpaid Leave') {
            let balance = await LeaveBalance.findOne({ userId: req.user.id });
            if (!balance) {
                balance = await LeaveBalance.create({ userId: req.user.id });
            }

            const remaining =
                leaveType === 'Paid Time Off'
                    ? balance.paidTimeOff.remaining
                    : balance.sickLeave.remaining;

            if (daysCount > remaining) {
                return res.status(400).json({
                    message: `Insufficient ${leaveType} balance`,
                    available: remaining,
                    requested: daysCount,
                });
            }
        }

        const leaveRequest = await LeaveRequest.create({
            userId: req.user.id,
            leaveType,
            startDate: start,
            endDate: end,
            daysCount,
            remarks: remarks.trim(),
            status: 'Pending',
        });

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leaveRequest,
        });
    } catch (error) {
        console.error('Apply Leave Error:', error);
        res.status(500).json({
            message: 'Failed to submit leave request',
            error: error.message,
        });
    }
};

// GET /api/leaves/my-requests (Employee)
exports.getMyLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Get My Leave Requests Error:', error);
        res.status(500).json({
            message: 'Failed to get leave requests',
            error: error.message,
        });
    }
};

// GET /api/leaves/admin/all (Admin Only)
exports.getAllLeaveRequestsAdmin = async (req, res) => {
    try {
        const requests = await LeaveRequest.find()
            .populate('userId', 'firstName lastName employeeId department designation email')
            .populate('reviewedBy', 'firstName lastName employeeId')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Get All Leave Requests Error:', error);
        res.status(500).json({
            message: 'Failed to get leave requests',
            error: error.message,
        });
    }
};

// PATCH /api/leaves/admin/:id/status (Admin Only)
exports.updateLeaveStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComments = '' } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be Approved or Rejected',
            });
        }

        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: 'Leave request not found',
            });
        }

        if (leaveRequest.status !== 'Pending') {
            return res.status(400).json({
                message: `Leave request is already ${leaveRequest.status}`,
            });
        }

        // If Rejected, do not modify balance or attendance
        if (status === 'Rejected') {
            leaveRequest.status = 'Rejected';
            leaveRequest.reviewedBy = req.user.id;
            leaveRequest.adminComments = adminComments.trim();

            await leaveRequest.save();

            return res.status(200).json({
                message: 'Leave request rejected',
                leaveRequest,
            });
        }

        // If Approved: deduct daysCount from appropriate LeaveBalance
        let balance = await LeaveBalance.findOne({ userId: leaveRequest.userId });
        if (!balance) {
            balance = await LeaveBalance.create({ userId: leaveRequest.userId });
        }

        const days = leaveRequest.daysCount;

        if (leaveRequest.leaveType === 'Paid Time Off') {
            if (days > balance.paidTimeOff.remaining) {
                return res.status(400).json({
                    message: 'Insufficient Paid Time Off balance',
                });
            }
            balance.paidTimeOff.used += days;
            balance.paidTimeOff.remaining -= days;
        } else if (leaveRequest.leaveType === 'Sick Leave') {
            if (days > balance.sickLeave.remaining) {
                return res.status(400).json({
                    message: 'Insufficient Sick Leave balance',
                });
            }
            balance.sickLeave.used += days;
            balance.sickLeave.remaining -= days;
        } else if (leaveRequest.leaveType === 'Unpaid Leave') {
            balance.unpaidLeave.used += days;
        }

        await balance.save();

        // Create or update Attendance records for every date in the leave range
        const start = new Date(leaveRequest.startDate);
        const end = new Date(leaveRequest.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const currentDate = new Date(start);

        while (currentDate <= end) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            await Attendance.findOneAndUpdate(
                {
                    userId: leaveRequest.userId,
                    date: dateString,
                },
                {
                    $set: {
                        userId: leaveRequest.userId,
                        date: dateString,
                        checkIn: null,
                        checkOut: null,
                        workHours: 0,
                        extraHours: 0,
                        status: 'Leave',
                    },
                },
                {
                    upsert: true,
                    new: true,
                }
            );

            currentDate.setDate(currentDate.getDate() + 1);
        }

        leaveRequest.status = 'Approved';
        leaveRequest.reviewedBy = req.user.id;
        leaveRequest.adminComments = adminComments.trim();

        await leaveRequest.save();

        res.status(200).json({
            message: 'Leave request approved successfully',
            leaveRequest,
            balance,
        });
    } catch (error) {
        console.error('Update Leave Status Error:', error);
        res.status(500).json({
            message: 'Failed to update leave request',
            error: error.message,
        });
    }
};
