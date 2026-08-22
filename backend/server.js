const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import Models & Routes
const User = require('./models/user');
const authRoutes = require('./routes/authroutes');
const employeeRoutes = require('./routes/employeeroutes');
const attendanceRoutes = require('./routes/attendanceroutes');
const leaveRoutes = require('./routes/leaveroutes');
const salaryRoutes = require('./routes/salaryroutes'); // Added Salary Routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/leave', leaveRoutes); // Alias for compatibility
app.use('/api/salary', salaryRoutes); // Registered Salary API Endpoint

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Seed Initial Admin User if not existing
async function seedAdmin() {
    try {
        const existingAdmin = await User.findOne({
            $or: [{ email: 'admin@dayflow.com' }, { role: 'admin' }]
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = new User({
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
                isFirstLogin: false,
            });
            await adminUser.save();
            console.log('Default Admin account created: admin@dayflow.com / admin123 (Login ID: DFADHR20260001)');
        }
    } catch (err) {
        console.error('Error seeding admin account:', err.message);
    }
}

// Database Connection & Server Initialization
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrm';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected Successfully');
        await seedAdmin();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        // Still listen on port so health check / error diagnostics work
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (Database disconnected)`);
        });
    });

module.exports = app;