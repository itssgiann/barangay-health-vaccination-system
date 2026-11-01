const BarangayZone = require('../models/barangayZone.model');

const getAll = (req, res) => {
    BarangayZone.getAll((err, results) => {
        if (err) {
            console.log('ZONE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    BarangayZone.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('ZONE ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Zone not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        zone_name,
        description
    } = req.body;

    if (!zone_name) {
        return res.status(400).json({
            message: 'zone_name is required'
        });
    }

    BarangayZone.create(
        {
            zone_name,
            description
        },
        (err, result) => {
            if (err) {
                console.log('ZONE ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Zone name already exists'
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
                message: 'Zone created',
                zone_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        zone_name,
        description
    } = req.body;

    if (!zone_name) {
        return res.status(400).json({
            message: 'zone_name is required'
        });
    }

    BarangayZone.update(
        req.params.id,
        {
            zone_name,
            description
        },
        (err, result) => {
            if (err) {
                console.log('ZONE ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Zone name already exists'
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
                    message: 'Zone not found'
                });
            }

            res.status(200).json({
                message: 'Zone updated'
            });
        }
    );
};

const remove = (req, res) => {
    BarangayZone.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('ZONE ERROR:', err);

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
                message: 'Zone not found'
            });
        }

        res.status(200).json({
            message: 'Zone deleted'
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