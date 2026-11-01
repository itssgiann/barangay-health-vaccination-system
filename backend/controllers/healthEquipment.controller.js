const HealthEquipment = require('../models/healthEquipment.model');

const getAll = (req, res) => {
    HealthEquipment.getAll((err, results) => {
        if (err) {
            console.log('EQUIPMENT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    HealthEquipment.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('EQUIPMENT ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Equipment not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        equipment_name,
        equipment_type,
        location,
        min_temp,
        max_temp,
        status,
        last_maintenance_date
    } = req.body;

    if (!equipment_name || !equipment_type) {
        return res.status(400).json({
            message: 'equipment_name and equipment_type are required'
        });
    }

    HealthEquipment.create(
        {
            equipment_name,
            equipment_type,
            location,
            min_temp,
            max_temp,
            status,
            last_maintenance_date
        },
        (err, result) => {
            if (err) {
                console.log('EQUIPMENT ERROR:', err);

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
                message: 'Equipment added',
                equipment_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        equipment_name,
        equipment_type,
        location,
        min_temp,
        max_temp,
        status,
        last_maintenance_date
    } = req.body;

    if (!equipment_name || !equipment_type) {
        return res.status(400).json({
            message: 'equipment_name and equipment_type are required'
        });
    }

    HealthEquipment.update(
        req.params.id,
        {
            equipment_name,
            equipment_type,
            location,
            min_temp,
            max_temp,
            status,
            last_maintenance_date
        },
        (err, result) => {
            if (err) {
                console.log('EQUIPMENT ERROR:', err);

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
                    message: 'Equipment not found'
                });
            }

            res.status(200).json({
                message: 'Equipment updated'
            });
        }
    );
};

const remove = (req, res) => {
    HealthEquipment.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('EQUIPMENT ERROR:', err);

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
                message: 'Equipment not found'
            });
        }

        res.status(200).json({
            message: 'Equipment deleted'
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
