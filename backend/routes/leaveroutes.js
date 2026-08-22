const express = require('express');
const router = express.Router();

const {
    getLeaveBalance,
    applyLeave,
    getMyLeaveRequests,
    getAllLeaveRequestsAdmin,
    updateLeaveStatusAdmin,
} = require('../controllers/leavecontroller');

const {
    verifyToken,
    verifyAdmin,
} = require('../middleware/auth');

// Employee routes
router.get('/balance', verifyToken, getLeaveBalance);
router.post('/apply', verifyToken, applyLeave);
router.get('/my-requests', verifyToken, getMyLeaveRequests);
router.get('/my-leaves', verifyToken, getMyLeaveRequests);

// Admin routes
router.get('/admin/all', verifyToken, verifyAdmin, getAllLeaveRequestsAdmin);
router.get('/all', verifyToken, verifyAdmin, getAllLeaveRequestsAdmin);
router.patch('/admin/:id/status', verifyToken, verifyAdmin, updateLeaveStatusAdmin);
router.put('/:id/status', verifyToken, verifyAdmin, updateLeaveStatusAdmin);

module.exports = router;
