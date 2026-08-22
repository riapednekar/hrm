const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['Admin', 'Employee'],
            default: 'Employee'
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            default: 'General'
        },
        designation: {
            type: String,
            default: 'Team Member'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);