const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Helper to generate custom Login ID
async function generateLoginId(companyName, firstName, lastName, year) {
    const compCode = (companyName || 'DF').substring(0, 2).toUpperCase();
    const fnCode = (firstName || 'EM').substring(0, 2).toUpperCase();
    const lnCode = (lastName || 'PL').substring(0, 2).toUpperCase();

    const count = await User.countDocuments({ companyName, yearOfJoining: year });
    const serial = String(count + 1).padStart(4, '0');

    return `${compCode}${fnCode}${lnCode}${year}${serial}`;
}

// Register (ALWAYS creates role: "employee")
router.post('/register', async (req, res) => {
    try {
        const { companyName, name, email, phone, password, companyLogo } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const [firstName, ...rest] = (name || '').trim().split(' ');
        const lastName = rest.join(' ') || 'User';
        const currentYear = new Date().getFullYear();

        const loginId = await generateLoginId(companyName || 'Dayflow Org', firstName, lastName, currentYear);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Enforce role: 'employee' regardless of any client input
        const newUser = new User({
            companyName: companyName || 'Dayflow Org',
            firstName: firstName || 'New',
            lastName: lastName || 'Employee',
            email,
            phone,
            password: hashedPassword,
            loginId,
            role: 'employee',
            companyLogo,
            yearOfJoining: currentYear,
            isFirstLogin: false,
        });

        await newUser.save();
        res.status(201).json({ 
            message: 'Registration successful!', 
            loginId, 
            role: 'employee' 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login using Login ID or Email
router.post('/login', async (req, res) => {
    try {
        const { loginIdentifier, password } = req.body;

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: 'Login ID/Email and password are required' });
        }

        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { loginId: loginIdentifier }]
        });

        if (!user) return res.status(400).json({ message: 'Invalid Login ID or Email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const normalizedRole = (user.role || 'employee').toLowerCase();

        const token = jwt.sign(
            { 
                id: user._id, 
                role: normalizedRole, 
                loginId: user.loginId, 
                companyName: user.companyName,
                email: user.email 
            },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                _id: user._id,
                loginId: user.loginId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                companyName: user.companyName,
                department: user.department || 'General',
                designation: user.designation || 'Associate',
                role: normalizedRole,
                isFirstLogin: user.isFirstLogin,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Current Logged-in User Profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            ...user.toObject(),
            role: (user.role || 'employee').toLowerCase(),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change Password for system-generated accounts
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(req.user.id, {
            password: hashedPassword,
            isFirstLogin: false,
        });

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;