import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { verifyToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Helper to generate custom Login ID
async function generateLoginId(companyName, firstName, lastName, year) {
    // 1. Company initials (First two letters of first word or company code)
    const compCode = companyName.substring(0, 2).toUpperCase();

    // 2. Name initials (First two of first name + first two of last name)
    const fnCode = firstName.substring(0, 2).toUpperCase();
    const lnCode = lastName.substring(0, 2).toUpperCase();

    // 3. Count existing users for this company & year to set serial number
    const count = await User.countDocuments({ companyName, yearOfJoining: year });
    const serial = String(count + 1).padStart(4, '0');

    return `${compCode}${fnCode}${lnCode}${year}${serial}`;
}

// Register Company Admin
router.post('/register', async (req, res) => {
    try {
        const { companyName, name, email, phone, password, companyLogo } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const [firstName, ...rest] = name.trim().split(' ');
        const lastName = rest.join(' ') || 'User';
        const currentYear = new Date().getFullYear();

        const loginId = await generateLoginId(companyName, firstName, lastName, currentYear);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            companyName,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            loginId,
            role: 'Admin',
            companyLogo,
            yearOfJoining: currentYear,
            isFirstLogin: false,
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration successful!', loginId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login using Login ID or Email
router.post('/login', async (req, res) => {
    try {
        const { loginIdentifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { loginId: loginIdentifier }]
        });

        if (!user) return res.status(400).json({ message: 'Invalid Login ID or Email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role, loginId: user.loginId, companyName: user.companyName },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin creates a new Employee with Auto-Generated Password and Login ID
router.post('/create-employee', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, email, phone } = req.body;
        const [firstName, ...rest] = name.trim().split(' ');
        const lastName = rest.join(' ') || 'User';
        const currentYear = new Date().getFullYear();

        const loginId = await generateLoginId(req.user.companyName, firstName, lastName, currentYear);

        // Auto-generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newEmployee = new User({
            companyName: req.user.companyName,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            loginId,
            role: 'Employee',
            yearOfJoining: currentYear,
            isFirstLogin: true,
        });

        await newEmployee.save();
        res.status(201).json({
            message: 'Employee created successfully',
            loginId,
            tempPassword
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change Password for system-generated accounts
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { newPassword } = req.body;
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

export default router;