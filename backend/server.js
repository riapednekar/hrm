const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authroutes = require('./routes/authroutes');
const employeeroutes = require('./routes/employeeroutes');
const attendanceroutes = require('./routes/attendanceroutes');
const leaveroutes = require('./routes/leaveroutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authroutes);
app.use('/api/employees', employeeroutes);
app.use('/api/attendance', attendanceroutes);
app.use('/api/leaves', leaveroutes);

// Test Route
app.get('/', (req, res) => {
    res.send('HRMS Backend API is running...');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms_db';
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
