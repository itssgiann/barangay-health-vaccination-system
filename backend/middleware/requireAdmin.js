const User = require('../models/user.model');

const requireAdmin = (req, res, next) => {
    const userId = Number(req.user?.user_id);

    if (!Number.isSafeInteger(userId) || userId < 1) {
        return res.status(401).json({
            message: 'Authentication required.'
        });
    }

    User.getById(userId, (err, results) => {
        if (err) {
            console.error('Authorization database error');

            return res.status(500).json({
                message: 'Unable to verify permissions.'
            });
        }

        const user = results?.[0];

        if (!user || Number(user.is_active) !== 1) {
            return res.status(401).json({
                message: 'Account not found or inactive.'
            });
        }

        if (user.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin only.'
            });
        }

        next();
    });
};

module.exports = requireAdmin;
