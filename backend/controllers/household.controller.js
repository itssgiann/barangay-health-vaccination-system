const Household = require('../models/household.model');

const getAll = (req, res) => {
    Household.getAll((err, results) => {
        if (err) {
            console.log('HOUSEHOLD ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    Household.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('HOUSEHOLD ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Household not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const { zone_id, household_name, address } = req.body;

    if (!zone_id || !household_name) {
        return res.status(400).json({
            message: 'zone_id and household_name are required'
        });
    }

    Household.create(
        { zone_id, household_name, address },
        (err, result) => {
            if (err) {
                console.log('HOUSEHOLD ERROR:', err);

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
                message: 'Household added',
                household_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const { zone_id, household_name, address } = req.body;

    if (!zone_id || !household_name) {
        return res.status(400).json({
            message: 'zone_id and household_name are required'
        });
    }

    Household.update(
        req.params.id,
        { zone_id, household_name, address },
        (err, result) => {
            if (err) {
                console.log('HOUSEHOLD ERROR:', err);

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
                    message: 'Household not found'
                });
            }

            res.status(200).json({
                message: 'Household updated'
            });
        }
    );
};

const remove = (req, res) => {
    Household.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('HOUSEHOLD ERROR:', err);

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
                message: 'Household not found'
            });
        }

        res.status(200).json({
            message: 'Household deleted'
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
