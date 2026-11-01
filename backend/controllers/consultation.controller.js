const Consultation = require('../models/consultation.model');

const getAll = (req, res) => {
    Consultation.getAll((err, results) => {
        if (err) {
            console.log('CONSULTATION ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    Consultation.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('CONSULTATION ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Consultation not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        resident_id,
        staff_id,
        consultation_date,
        temperature_celsius,
        blood_pressure,
        pulse_rate,
        weight_kg,
        height_cm,
        chief_complaint,
        diagnosis,
        notes
    } = req.body;

    if (!resident_id || !staff_id || !consultation_date) {
        return res.status(400).json({
            message: 'resident_id, staff_id and consultation_date are required'
        });
    }

    Consultation.create(
        {
            resident_id,
            staff_id,
            consultation_date,
            temperature_celsius,
            blood_pressure,
            pulse_rate,
            weight_kg,
            height_cm,
            chief_complaint,
            diagnosis,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('CONSULTATION ERROR:', err);

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
                message: 'Consultation created',
                consultation_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        resident_id,
        staff_id,
        consultation_date,
        temperature_celsius,
        blood_pressure,
        pulse_rate,
        weight_kg,
        height_cm,
        chief_complaint,
        diagnosis,
        notes
    } = req.body;

    if (!resident_id || !staff_id || !consultation_date) {
        return res.status(400).json({
            message: 'resident_id, staff_id and consultation_date are required'
        });
    }

    Consultation.update(
        req.params.id,
        {
            resident_id,
            staff_id,
            consultation_date,
            temperature_celsius,
            blood_pressure,
            pulse_rate,
            weight_kg,
            height_cm,
            chief_complaint,
            diagnosis,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('CONSULTATION ERROR:', err);

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
                    message: 'Consultation not found'
                });
            }

            res.status(200).json({
                message: 'Consultation updated'
            });
        }
    );
};

const remove = (req, res) => {
    Consultation.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('CONSULTATION ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Consultation not found'
            });
        }

        res.status(200).json({
            message: 'Consultation deleted'
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