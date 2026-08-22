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

// Employee Routes (Requires valid JWT)
router.post('/check-in', verifyToken, checkIn);
router.post('/check-out', verifyToken, checkOut);
router.get('/status', verifyToken, getTodayStatus);
router.get('/my-history', verifyToken, getMyHistory);

// Admin Routes (Requires valid JWT + Admin Role)
router.get('/admin/all', verifyToken, verifyAdmin, getAllAttendanceAdmin);

module.exports = router;
