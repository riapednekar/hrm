const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate sequential Employee ID (EMP-1001, EMP-1002, etc.)
const generateEmployeeId = async () => {
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    if (!lastUser || !lastUser.employeeId) {
        return 'EMP-1001';
    }
    const lastIdNum = parseInt(lastUser.employeeId.replace('EMP-', ''), 10);
    return `EMP-${lastIdNum + 1}`;
};

// Register Controller
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, department, designation } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const employeeId = await generateEmployeeId();

        const newUser = new User({
            employeeId,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'Employee',
            department,
            designation
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            employeeId: newUser.employeeId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                employeeId: user.employeeId
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                employeeId: user.employeeId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};