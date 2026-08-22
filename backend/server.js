const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authroutes = require('./routes/authroutes');
const employeeroutes = require('./routes/employeeroutes');
const attendanceroutes = require('./routes/attendanceroutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authroutes);
app.use('/api/employees', employeeroutes);
app.use('/api/attendance', attendanceroutes);

// Test Route
app.get('/', (req, res) => {
    res.send('HRMS Backend API is running...');
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));