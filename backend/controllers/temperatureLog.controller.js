const TemperatureLog = require('../models/temperatureLog.model');

const getAll = (req, res) => {
    TemperatureLog.getAll((err, results) => {
        if (err) {
            console.log('TEMPERATURE LOG ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    TemperatureLog.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('TEMPERATURE LOG ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Temperature log not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        equipment_id,
        recorded_by,
        temperature_celsius,
        is_out_of_range,
        recorded_at
    } = req.body;

    if (
        !equipment_id ||
        !recorded_by ||
        temperature_celsius === undefined ||
        is_out_of_range === undefined ||
        !recorded_at
    ) {
        return res.status(400).json({
            message: 'equipment_id, recorded_by, temperature_celsius, is_out_of_range and recorded_at are required'
        });
    }

    TemperatureLog.create(
        {
            equipment_id,
            recorded_by,
            temperature_celsius,
            is_out_of_range,
            recorded_at
        },
        (err, result) => {
            if (err) {
                console.log('TEMPERATURE LOG ERROR:', err);

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
                message: 'Temperature log added',
                log_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        equipment_id,
        recorded_by,
        temperature_celsius,
        is_out_of_range,
        recorded_at
    } = req.body;

    if (
        !equipment_id ||
        !recorded_by ||
        temperature_celsius === undefined ||
        is_out_of_range === undefined ||
        !recorded_at
    ) {
        return res.status(400).json({
            message: 'equipment_id, recorded_by, temperature_celsius, is_out_of_range and recorded_at are required'
        });
    }

    TemperatureLog.update(
        req.params.id,
        {
            equipment_id,
            recorded_by,
            temperature_celsius,
            is_out_of_range,
            recorded_at
        },
        (err, result) => {
            if (err) {
                console.log('TEMPERATURE LOG ERROR:', err);

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
                    message: 'Temperature log not found'
                });
            }

            res.status(200).json({
                message: 'Temperature log updated'
            });
        }
    );
};

const remove = (req, res) => {
    TemperatureLog.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('TEMPERATURE LOG ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Temperature log not found'
            });
        }

        res.status(200).json({
            message: 'Temperature log deleted'
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
