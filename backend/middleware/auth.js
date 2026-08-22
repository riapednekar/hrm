const jwt = require('jsonwebtoken');

// Verify if JWT token is present and valid
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Payload: { id, role, email, employeeId }
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

// Middleware to restrict access to Admin users only
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Admin privileges required' });
    }
};

module.exports = { verifyToken, verifyAdmin };