import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    loginId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
    isFirstLogin: { type: Boolean, default: true },
    companyLogo: { type: String },
    yearOfJoining: { type: Number, default: new Date().getFullYear() },
}, { timestamps: true });

export default mongoose.model('User', userSchema);