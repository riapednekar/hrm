const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Helper to generate custom Login ID
async function generateLoginId(companyName, firstName, lastName, year) {
    const compCode = (companyName || 'DF').substring(0, 2).toUpperCase();
    const fnCode = (firstName || 'EM').substring(0, 2).toUpperCase();
    const lnCode = (lastName || 'PL').substring(0, 2).toUpperCase();

    const count = await User.countDocuments({ companyName, yearOfJoining: year });
    const serial = String(count + 1).padStart(4, '0');

    return `${compCode}${fnCode}${lnCode}${year}${serial}`;
}

// Get all employees (Admin Only)
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching employees', error: error.message });
    }
};

// Get single employee by ID (Admin or Self)
exports.getEmployeeById = async (req, res) => {
    try {
        // Employees can only view their own profile; Admin can view any
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot view other employee details' });
        }

        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching employee details', error: error.message });
    }
};

// Create new Employee (Admin Only)
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, phone, role, department, designation, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const [firstName, ...rest] = (name || '').trim().split(' ');
        const lastName = rest.join(' ') || 'User';
        const currentYear = new Date().getFullYear();

        const loginId = await generateLoginId(req.user.companyName || 'Dayflow', firstName, lastName, currentYear);
        const autoPassword = password || Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(autoPassword, 10);

        const newEmployee = new User({
            companyName: req.user.companyName || 'Dayflow Org',
            firstName: firstName || 'New',
            lastName: lastName || 'Employee',
            email,
            phone,
            password: hashedPassword,
            loginId,
            role: (role === 'admin') ? 'admin' : 'employee',
            department: department || 'General',
            designation: designation || 'Associate',
            yearOfJoining: currentYear,
            isFirstLogin: true,
        });

        await newEmployee.save();

        res.status(201).json({
            message: 'Employee created successfully',
            employee: {
                id: newEmployee._id,
                loginId: newEmployee.loginId,
                name: `${newEmployee.firstName} ${newEmployee.lastName}`,
                email: newEmployee.email,
                role: newEmployee.role,
                department: newEmployee.department,
                designation: newEmployee.designation,
                tempPassword: autoPassword,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating employee', error: error.message });
    }
};