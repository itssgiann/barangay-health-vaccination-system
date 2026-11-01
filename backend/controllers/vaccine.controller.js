const Vaccine = require('../models/vaccine.model');

const checkVaccine = (data) => {
    if (!data.vaccine_name || !data.total_doses_required) {
        return 'vaccine_name and total_doses_required are required';
    }

    if (data.total_doses_required < 1) {
        return 'total_doses_required must be at least 1';
    }

    if (
        data.storage_temp_min !== undefined &&
        data.storage_temp_max !== undefined &&
        data.storage_temp_min > data.storage_temp_max
    ) {
        return 'Minimum temperature cannot exceed maximum temperature';
    }

    return null;
};

const getAll = (req, res) => {
    Vaccine.getAll((err, results) => {
        if (err) {
            console.log('VACCINE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    Vaccine.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('VACCINE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Vaccine not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        vaccine_name,
        description,
        total_doses_required,
        storage_temp_min,
        storage_temp_max
    } = req.body;

    const data = {
        vaccine_name,
        description,
        total_doses_required,
        storage_temp_min,
        storage_temp_max
    };

    const problem = checkVaccine(data);

    if (problem) {
        return res.status(400).json({
            message: problem
        });
    }

    Vaccine.create(data, (err, result) => {
        if (err) {
            console.log('VACCINE ERROR:', err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Vaccine name already exists'
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
            message: 'Vaccine added',
            vaccine_id: result.insertId
        });
    });
};

const update = (req, res) => {
    const {
        vaccine_name,
        description,
        total_doses_required,
        storage_temp_min,
        storage_temp_max
    } = req.body;

    const data = {
        vaccine_name,
        description,
        total_doses_required,
        storage_temp_min,
        storage_temp_max
    };

    const problem = checkVaccine(data);

    if (problem) {
        return res.status(400).json({
            message: problem
        });
    }

    Vaccine.update(req.params.id, data, (err, result) => {
        if (err) {
            console.log('VACCINE ERROR:', err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Vaccine name already exists'
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
                message: 'Vaccine not found'
            });
        }

        res.status(200).json({
            message: 'Vaccine updated'
        });
    });
};

const remove = (req, res) => {
    Vaccine.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('VACCINE ERROR:', err);

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
                message: 'Vaccine not found'
            });
        }

        res.status(200).json({
            message: 'Vaccine deleted'
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
