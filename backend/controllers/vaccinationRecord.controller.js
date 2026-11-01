const VaccinationRecord = require('../models/vaccinationRecord.model');

const getAll = (req, res) => {
    VaccinationRecord.getAll((err, results) => {
        if (err) {
            console.log('RECORD ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    VaccinationRecord.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('RECORD ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Vaccination record not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        resident_id,
        batch_id,
        staff_id,
        milestone_id,
        date_administered,
        next_due_date,
        next_dose_status,
        remarks
    } = req.body;

    if (
        !resident_id ||
        !batch_id ||
        !staff_id ||
        !milestone_id ||
        !date_administered
    ) {
        return res.status(400).json({
            message: 'resident_id, batch_id, staff_id, milestone_id and date_administered are required'
        });
    }

    VaccinationRecord.create(
        {
            resident_id,
            batch_id,
            staff_id,
            milestone_id,
            date_administered,
            next_due_date,
            next_dose_status,
            remarks
        },
        (err, result) => {
            if (err) {
                console.log('RECORD ERROR:', err);

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
                message: 'Vaccination record created',
                record_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        resident_id,
        batch_id,
        staff_id,
        milestone_id,
        date_administered,
        next_due_date,
        next_dose_status,
        remarks
    } = req.body;

    if (
        !resident_id ||
        !batch_id ||
        !staff_id ||
        !milestone_id ||
        !date_administered
    ) {
        return res.status(400).json({
            message: 'resident_id, batch_id, staff_id, milestone_id and date_administered are required'
        });
    }

    VaccinationRecord.update(
        req.params.id,
        {
            resident_id,
            batch_id,
            staff_id,
            milestone_id,
            date_administered,
            next_due_date,
            next_dose_status,
            remarks
        },
        (err, result) => {
            if (err) {
                console.log('RECORD ERROR:', err);

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
                    message: 'Vaccination record not found'
                });
            }

            res.status(200).json({
                message: 'Vaccination record updated'
            });
        }
    );
};

const remove = (req, res) => {
    VaccinationRecord.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('RECORD ERROR:', err);

            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    message: 'Cannot delete: other records depend on this one'
                });
            }

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Vaccination record not found'
            });
        }

        res.status(200).json({
            message: 'Vaccination record deleted'
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