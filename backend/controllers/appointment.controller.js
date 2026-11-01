const Appointment = require('../models/appointment.model');

const getAll = (req, res) => {
    Appointment.getAll((err, results) => {
        if (err) {
            console.log('APPOINTMENT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    Appointment.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('APPOINTMENT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        resident_id,
        vaccine_id,
        staff_id,
        dose_number,
        scheduled_date,
        status,
        notes
    } = req.body;

    if (
        !resident_id ||
        !vaccine_id ||
        !staff_id ||
        !dose_number ||
        !scheduled_date
    ) {
        return res.status(400).json({
            message: 'resident_id, vaccine_id, staff_id, dose_number and scheduled_date are required'
        });
    }

    Appointment.create(
        {
            resident_id,
            vaccine_id,
            staff_id,
            dose_number,
            scheduled_date,
            status,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('APPOINTMENT ERROR:', err);

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
                message: 'Appointment scheduled',
                appointment_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        resident_id,
        vaccine_id,
        staff_id,
        dose_number,
        scheduled_date,
        status,
        notes
    } = req.body;

    if (
        !resident_id ||
        !vaccine_id ||
        !staff_id ||
        !dose_number ||
        !scheduled_date
    ) {
        return res.status(400).json({
            message: 'resident_id, vaccine_id, staff_id, dose_number and scheduled_date are required'
        });
    }

    Appointment.update(
        req.params.id,
        {
            resident_id,
            vaccine_id,
            staff_id,
            dose_number,
            scheduled_date,
            status,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('APPOINTMENT ERROR:', err);

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
                    message: 'Appointment not found'
                });
            }

            res.status(200).json({
                message: 'Appointment updated'
            });
        }
    );
};

const remove = (req, res) => {
    Appointment.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('APPOINTMENT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            message: 'Appointment deleted'
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
