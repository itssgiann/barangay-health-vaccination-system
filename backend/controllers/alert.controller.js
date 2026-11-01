const Alert = require('../models/alert.model');

const getAll = (req, res) => {
    Alert.getAll((err, results) => {
        if (err) {
            console.log('ALERT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    Alert.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('ALERT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        assigned_to,
        alert_type,
        severity,
        message,
        related_id,
        status,
        created_at,
        resolved_at
    } = req.body;

    if (
        !assigned_to ||
        !alert_type ||
        !severity ||
        !message ||
        !status
    ) {
        return res.status(400).json({
            message: 'assigned_to, alert_type, severity, message and status are required'
        });
    }

    Alert.create(
        {
            assigned_to,
            alert_type,
            severity,
            message,
            related_id,
            status,
            created_at,
            resolved_at
        },
        (err, result) => {
            if (err) {
                console.log('ALERT ERROR:', err);

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Invalid reference: a related record does not exist'
                    });
                }

                if (
                    err.code === 'ER_DATA_TOO_LONG' ||
                    err.code === 'ER_TRUNCATED_WRONG_VALUE'
                ) {
                    return res.status(400).json({
                        message: 'Invalid data: check the values you sent'
                    });
                }

                return res.status(500).json({
                    message: 'Database error',
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Alert created',
                alert_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        assigned_to,
        alert_type,
        severity,
        message,
        related_id,
        status,
        created_at,
        resolved_at
    } = req.body;

    if (
        !assigned_to ||
        !alert_type ||
        !severity ||
        !message ||
        !status
    ) {
        return res.status(400).json({
            message: 'assigned_to, alert_type, severity, message and status are required'
        });
    }

    Alert.update(
        req.params.id,
        {
            assigned_to,
            alert_type,
            severity,
            message,
            related_id,
            status,
            resolved_at
        },
        (err, result) => {
            if (err) {
                console.log('ALERT ERROR:', err);

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Invalid reference: a related record does not exist'
                    });
                }

                if (
                    err.code === 'ER_DATA_TOO_LONG' ||
                    err.code === 'ER_TRUNCATED_WRONG_VALUE'
                ) {
                    return res.status(400).json({
                        message: 'Invalid data: check the values you sent'
                    });
                }

                return res.status(500).json({
                    message: 'Database error',
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Alert not found'
                });
            }

            res.status(200).json({
                message: 'Alert updated'
            });
        }
    );
};

const remove = (req, res) => {
    Alert.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('ALERT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            message: 'Alert deleted'
        });
    });
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
