const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    loginId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee', lowercase: true },
    department: { type: String, default: 'General' },
    designation: { type: String, default: 'Associate' },
    isFirstLogin: { type: Boolean, default: true },
    companyLogo: { type: String },
    yearOfJoining: { type: Number, default: new Date().getFullYear() },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);