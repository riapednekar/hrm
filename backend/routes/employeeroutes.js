const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, createEmployee } = require('../controllers/employeecontroller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Protected routes
router.get('/', verifyToken, verifyAdmin, getAllEmployees);
router.post('/', verifyToken, verifyAdmin, createEmployee);
router.get('/:id', verifyToken, getEmployeeById);

module.exports = router;