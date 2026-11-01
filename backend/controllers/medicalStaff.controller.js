const MedicalStaff = require('../models/medicalStaff.model');

const getAll = (req, res) => {
    MedicalStaff.getAll((err, results) => {
        if (err) {
            console.log('STAFF ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    MedicalStaff.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('STAFF ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Medical staff not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        zone_id,
        first_name,
        last_name,
        staff_role,
        license_number,
        contact_number,
        is_active
    } = req.body;

    if (!zone_id || !first_name || !last_name || !staff_role) {
        return res.status(400).json({
            message: 'zone_id, first_name, last_name and staff_role are required'
        });
    }

    MedicalStaff.create(
        {
            zone_id,
            first_name,
            last_name,
            staff_role,
            license_number,
            contact_number,
            is_active
        },
        (err, result) => {
            if (err) {
                console.log('STAFF ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'License number already exists'
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
                message: 'Medical staff added',
                staff_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        zone_id,
        first_name,
        last_name,
        staff_role,
        license_number,
        contact_number,
        is_active
    } = req.body;

    if (!zone_id || !first_name || !last_name || !staff_role) {
        return res.status(400).json({
            message: 'zone_id, first_name, last_name and staff_role are required'
        });
    }

    MedicalStaff.update(
        req.params.id,
        {
            zone_id,
            first_name,
            last_name,
            staff_role,
            license_number,
            contact_number,
            is_active
        },
        (err, result) => {
            if (err) {
                console.log('STAFF ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'License number already exists'
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
                    message: 'Medical staff not found'
                });
            }

            res.status(200).json({
                message: 'Medical staff updated'
            });
        }
    );
};

const remove = (req, res) => {
    MedicalStaff.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('STAFF ERROR:', err);

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
                message: 'Medical staff not found'
            });
        }

        res.status(200).json({
            message: 'Medical staff deleted'
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
