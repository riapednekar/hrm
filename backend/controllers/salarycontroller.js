const User = require('../models/user');

// GET /api/salary (Employee / Admin)
exports.getSalaryDetails = async (req, res) => {
    try {
        let user = null;
        if (req.user && req.user.id) {
            user = await User.findById(req.user.id);
        }

        const isAdmin = user && (user.role || '').toLowerCase() === 'admin';
        const baseSalary = isAdmin ? 8500 : 5200;
        const bonus = isAdmin ? 1200 : 600;
        const allowances = isAdmin ? 1500 : 800; // HRA, Medical, Transport
        const deductions = isAdmin ? 650 : 350; // Tax, Provident Fund, Insurance
        const netPay = baseSalary + bonus + allowances - deductions;

        const salaryInfo = {
            employeeName: user ? `${user.firstName} ${user.lastName}` : 'Dayflow Associate',
            loginId: user?.loginId || 'DF20260001',
            department: user?.department || 'General',
            designation: user?.designation || 'Associate',
            payPeriod: 'Monthly',
            currency: 'USD',
            currencySymbol: '$',
            baseSalary,
            bonus,
            allowances,
            deductions,
            netPay,
            breakdown: {
                hra: Math.round(allowances * 0.5),
                medicalAllowance: Math.round(allowances * 0.25),
                travelAllowance: Math.round(allowances * 0.25),
                taxDeduction: Math.round(deductions * 0.6),
                providentFund: Math.round(deductions * 0.4),
            },
            paymentMethod: {
                bankName: 'Silicon Valley Federal Bank',
                accountNumberMasked: '•••• •••• •••• 4892',
                status: 'Direct Deposit Active'
            },
            history: [
                { month: 'July 2026', gross: baseSalary + bonus + allowances, deductions, net: netPay, status: 'Paid', date: '2026-07-31' },
                { month: 'June 2026', gross: baseSalary + bonus + allowances, deductions, net: netPay, status: 'Paid', date: '2026-06-30' },
                { month: 'May 2026', gross: baseSalary + bonus + allowances, deductions, net: netPay, status: 'Paid', date: '2026-05-31' },
            ]
        };

        return res.status(200).json(salaryInfo);
    } catch (error) {
        console.error('Error retrieving salary info:', error);
        return res.status(500).json({ message: 'Error retrieving salary info', error: error.message });
    }
};