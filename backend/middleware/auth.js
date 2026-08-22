const jwt = require('jsonwebtoken');

// Verify if JWT token is present and valid
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = verified; // Payload: { id, role, email, loginId, companyName }
        if (req.user.role) {
            req.user.role = req.user.role.toLowerCase();
        }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

// Middleware to restrict access to Admin users only
const verifyAdmin = (req, res, next) => {
    const role = (req.user && req.user.role) ? req.user.role.toLowerCase() : '';
    if (role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Admin privileges required' });
    }
};

module.exports = { verifyToken, verifyAdmin };