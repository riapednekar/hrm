const express = require('express');
const { getSalaryDetails } = require('../controllers/salarycontroller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Allow authenticated user to fetch their salary info (falls back gracefully if unauthenticated)
router.get('/', (req, res, next) => {
    // If token header is provided, verify it, otherwise proceed
    if (req.headers.authorization) {
        return verifyToken(req, res, next);
    }
    next();
}, getSalaryDetails);

module.exports = router;