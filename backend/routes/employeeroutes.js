const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById } = require('../controllers/employeecontroller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Protected routes (Requires valid JWT + Admin Role)
router.get('/', verifyToken, verifyAdmin, getAllEmployees);
router.get('/:id', verifyToken, verifyAdmin, getEmployeeById);

module.exports = router;