const ImmunizationMilestone = require('../models/immunizationMilestone.model');

const getAll = (req, res) => {
    ImmunizationMilestone.getAll((err, results) => {
        if (err) {
            console.log('MILESTONE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    ImmunizationMilestone.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('MILESTONE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Milestone not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        vaccine_id,
        dose_number,
        recommended_age_days,
        min_interval_days,
        notes
    } = req.body;

    if (
        !vaccine_id ||
        !dose_number ||
        recommended_age_days === undefined ||
        min_interval_days === undefined
    ) {
        return res.status(400).json({
            message: 'vaccine_id, dose_number, recommended_age_days and min_interval_days are required'
        });
    }

    ImmunizationMilestone.create(
        {
            vaccine_id,
            dose_number,
            recommended_age_days,
            min_interval_days,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('MILESTONE ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'That vaccine already has this dose number'
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
                message: 'Milestone added successfully',
                milestone_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        vaccine_id,
        dose_number,
        recommended_age_days,
        min_interval_days,
        notes
    } = req.body;

    if (
        !vaccine_id ||
        !dose_number ||
        recommended_age_days === undefined ||
        min_interval_days === undefined
    ) {
        return res.status(400).json({
            message: 'vaccine_id, dose_number, recommended_age_days and min_interval_days are required'
        });
    }

    ImmunizationMilestone.update(
        req.params.id,
        {
            vaccine_id,
            dose_number,
            recommended_age_days,
            min_interval_days,
            notes
        },
        (err, result) => {
            if (err) {
                console.log('MILESTONE ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'That vaccine already has this dose number'
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
                    message: 'Milestone not found'
                });
            }

            res.status(200).json({
                message: 'Milestone updated'
            });
        }
    );
};

const remove = (req, res) => {
    ImmunizationMilestone.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('MILESTONE ERROR:', err);

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
                message: 'Milestone not found'
            });
        }

        res.status(200).json({
            message: 'Milestone deleted'
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