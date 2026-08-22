const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user');
const authroutes = require('./routes/authroutes');
const employeeroutes = require('./routes/employeeroutes');
const attendanceroutes = require('./routes/attendanceroutes');
const leaveroutes = require('./routes/leaveroutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authroutes);
app.use('/api/employees', employeeroutes);
app.use('/api/attendance', attendanceroutes);
app.use('/api/leaves', leaveroutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Dayflow HRMS Backend API is running...');
});

// Seed default Admin user if none exists
async function seedAdmin() {
    try {
        const adminExists = await User.findOne({ 
            $or: [{ email: 'admin@dayflow.com' }, { role: 'admin' }] 
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const defaultAdmin = new User({
                companyName: 'Dayflow Inc.',
                firstName: 'Admin',
                lastName: 'HR',
                email: 'admin@dayflow.com',
                phone: '+91 98765 43210',
                password: hashedPassword,
                loginId: 'DFADHR20260001',
                role: 'admin',
                department: 'Human Resources',
                designation: 'HR Administrator',
                yearOfJoining: 2026,
                isFirstLogin: false,
            });
            await defaultAdmin.save();
            console.log('Default Admin account created: admin@dayflow.com / admin123 (Login ID: DFADHR20260001)');
        } else {
            console.log(`Admin account already exists: ${adminExists.email} (Role: ${adminExists.role})`);
        }
    } catch (err) {
        console.error('Error seeding admin account:', err.message);
    }
}

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected Successfully');
        await seedAdmin();
    })
    .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));