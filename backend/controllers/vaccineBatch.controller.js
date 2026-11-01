const VaccineBatch = require('../models/vaccineBatch.model');

const getAll = (req, res) => {
    VaccineBatch.getAll((err, results) => {
        if (err) {
            console.log('BATCH ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    VaccineBatch.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('BATCH ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Batch not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        vaccine_id,
        equipment_id,
        batch_number,
        quantity_received,
        quantity_remaining,
        received_date,
        expiry_date,
        status
    } = req.body;

    if (
        !vaccine_id ||
        !equipment_id ||
        !batch_number ||
        !quantity_received ||
        quantity_remaining === undefined ||
        !received_date ||
        !expiry_date
    ) {
        return res.status(400).json({
            message: 'vaccine_id, equipment_id, batch_number, quantity_received, quantity_remaining, received_date and expiry_date are required'
        });
    }

    VaccineBatch.create(
        {
            vaccine_id,
            equipment_id,
            batch_number,
            quantity_received,
            quantity_remaining,
            received_date,
            expiry_date,
            status
        },
        (err, result) => {
            if (err) {
                console.log('BATCH ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Batch number already exists'
                    });
                }

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
                message: 'Batch added successfully',
                batch_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        vaccine_id,
        equipment_id,
        batch_number,
        quantity_received,
        quantity_remaining,
        received_date,
        expiry_date,
        status
    } = req.body;

    if (
        !vaccine_id ||
        !equipment_id ||
        !batch_number ||
        !quantity_received ||
        quantity_remaining === undefined ||
        !received_date ||
        !expiry_date
    ) {
        return res.status(400).json({
            message: 'vaccine_id, equipment_id, batch_number, quantity_received, quantity_remaining, received_date and expiry_date are required'
        });
    }

    VaccineBatch.update(
        req.params.id,
        {
            vaccine_id,
            equipment_id,
            batch_number,
            quantity_received,
            quantity_remaining,
            received_date,
            expiry_date,
            status
        },
        (err, result) => {
            if (err) {
                console.log('BATCH ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Batch number already exists'
                    });
                }

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
                    message: 'Batch not found'
                });
            }

            res.status(200).json({
                message: 'Batch updated'
            });
        }
    );
};

const remove = (req, res) => {
    VaccineBatch.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('BATCH ERROR:', err);

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
                message: 'Batch not found'
            });
        }

        res.status(200).json({
            message: 'Batch deleted'
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
