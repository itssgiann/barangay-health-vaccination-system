const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    let verified;

    try {
        verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }

    const userId = Number(verified.user_id);

    if (!Number.isSafeInteger(userId) || userId < 1) {
        return res.status(401).json({
            message: 'Invalid user session.'
        });
    }

    User.getById(userId, (err, results) => {
        if (err) {
            console.error('Authentication database error:', err);

            return res.status(500).json({
                message: 'Unable to verify account.'
            });
        }

        const user = results?.[0];

        if (!user || Number(user.is_active) !== 1) {
            return res.status(401).json({
                message: 'Account inactive or not found.'
            });
        }

        req.user = {
            ...verified,
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            staff_id: user.staff_id
        };

        next();
    });
};

module.exports = verifyToken;
