const User = require('../models/user');

// Get all employees (Admin Only)
exports.getAllEmployees = async (req, res) => {
    try {
        // Return all users excluding their password fields
        const employees = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching employees', error: error.message });
    }
};

// Get single employee by ID (Admin / View-Only Modal)
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching employee details', error: error.message });
    }
};