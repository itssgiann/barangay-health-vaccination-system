const BatchExpiry = require('../models/batchExpiry.model');

const sendError = (res, err) => {
    console.log('EXPIRY ERROR:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            message: 'Invalid staff_id: that staff member does not exist'
        });
    }

    return res.status(500).json({
        message: 'Database error',
        error: err.message
    });
};

const getExpiring = (req, res) => {
    const days = Number(req.query.days || 30);

    if (isNaN(days) || days < 1) {
        return res.status(400).json({
            message: 'days must be a number of 1 or more'
        });
    }

    BatchExpiry.getExpiring(days, (err, results) => {
        if (err) {
            return sendError(res, err);
        }

        res.status(200).json(results);
    });
};

const runCheck = (req, res) => {
    const { staff_id, days } = req.body;
    const warningDays = Number(days || 30);

    if (!staff_id) {
        return res.status(400).json({
            message: 'staff_id is required'
        });
    }

    if (isNaN(warningDays) || warningDays < 1) {
        return res.status(400).json({
            message: 'days must be a number of 1 or more'
        });
    }

    BatchExpiry.markExpired((err, expiredResult) => {
        if (err) {
            return sendError(res, err);
        }

        BatchExpiry.createNearExpiryAlerts(
            staff_id,
            warningDays,
            (err, nearResult) => {
                if (err) {
                    return sendError(res, err);
                }

                BatchExpiry.createExpiredAlerts(
                    staff_id,
                    (err, expiredAlertResult) => {
                        if (err) {
                            return sendError(res, err);
                        }

                        res.status(200).json({
                            message: 'Expiry check done',
                            batches_marked_expired: expiredResult.affectedRows,
                            near_expiry_alerts_created: nearResult.affectedRows,
                            expired_alerts_created: expiredAlertResult.affectedRows
                        });
                    }
                );
            }
        );
    });
};

module.exports = {
    getExpiring,
    runCheck
};