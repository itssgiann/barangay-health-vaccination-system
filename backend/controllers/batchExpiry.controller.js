const BatchExpiry = require('../models/batchExpiry.model');

const sendError = (res, err) => {
    console.error('Expiry monitoring error:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: 'The assigned staff account could not be found.' });
    }
    return res.status(500).json({ message: 'Could not update vaccine expiry information. Contact your system administrator.' });
};

const parseDays = value => {
    const days = Number(value ?? 30);
    return Number.isSafeInteger(days) && days >= 1 && days <= 365 ? days : null;
};

const getExpiring = (req, res) => {
    const days = parseDays(req.query.days);
    if (days === null) return res.status(400).json({ message: 'Warning window must be a whole number between 1 and 365 days.' });
    BatchExpiry.getExpiring(days, (err, rows) => {
        if (err) return sendError(res, err);
        return res.status(200).json(rows);
    });
};

const runCheck = (req, res) => {
    // Use the authenticated staff ID; never trust a user-supplied staff ID.
    const staffId = Number(req.user?.staff_id);
    const days = parseDays(req.body?.days);
    if (!Number.isSafeInteger(staffId) || staffId < 1) {
        return res.status(403).json({ message: 'Your account is not linked to a staff member.' });
    }
    if (days === null) return res.status(400).json({ message: 'Warning window must be between 1 and 365 days.' });

    BatchExpiry.markExpired((err, expiredResult) => {
        if (err) return sendError(res, err);
        BatchExpiry.resolveOutdatedNearExpiryAlerts((err, resolvedResult) => {
            if (err) return sendError(res, err);
            BatchExpiry.createNearExpiryAlerts(staffId, days, (err, nearResult) => {
                if (err) return sendError(res, err);
                BatchExpiry.createExpiredAlerts(staffId, (err, expiredAlertResult) => {
                    if (err) return sendError(res, err);
                    return res.status(200).json({
                        message: 'Expiry monitoring updated successfully.',
                        batches_marked_expired: expiredResult.affectedRows,
                        obsolete_near_expiry_alerts_resolved: resolvedResult.affectedRows,
                        near_expiry_alerts_created: nearResult.affectedRows,
                        expired_alerts_created: expiredAlertResult.affectedRows
                    });
                });
            });
        });
    });
};

module.exports = { getExpiring, runCheck };
