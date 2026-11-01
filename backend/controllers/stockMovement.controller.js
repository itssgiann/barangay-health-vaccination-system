const StockMovement = require('../models/stockMovement.model');

const getAll = (req, res) => {
    StockMovement.getAll((err, results) => {
        if (err) {
            console.log('STOCK ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getByBatch = (req, res) => {
    StockMovement.getByBatch(req.params.batchId, (err, results) => {
        if (err) {
            console.log('STOCK ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    StockMovement.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('STOCK ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Stock movement not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        batch_id,
        staff_id,
        movement_type,
        quantity,
        remarks,
        movement_date
    } = req.body;

    if (!batch_id || !staff_id || !movement_type || !quantity) {
        return res.status(400).json({
            message: 'batch_id, staff_id, movement_type and quantity are required'
        });
    }

    StockMovement.create(
        {
            batch_id,
            staff_id,
            movement_type,
            quantity,
            remarks,
            movement_date
        },
        (err, result) => {
            if (err) {
                console.log('STOCK ERROR:', err);

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
                message: 'Stock movement recorded successfully',
                movement_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        batch_id,
        staff_id,
        movement_type,
        quantity,
        remarks,
        movement_date
    } = req.body;

    if (!batch_id || !staff_id || !movement_type || !quantity) {
        return res.status(400).json({
            message: 'batch_id, staff_id, movement_type and quantity are required'
        });
    }

    StockMovement.update(
        req.params.id,
        {
            batch_id,
            staff_id,
            movement_type,
            quantity,
            remarks
        },
        (err, result) => {
            if (err) {
                console.log('STOCK ERROR:', err);

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
                    message: 'Stock movement not found'
                });
            }

            res.status(200).json({
                message: 'Stock movement updated'
            });
        }
    );
};

const remove = (req, res) => {
    StockMovement.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('STOCK ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Stock movement not found'
            });
        }

        res.status(200).json({
            message: 'Stock movement deleted'
        });
    });
};

module.exports = {
    getAll,
    getByBatch,
    getById,
    create,
    update,
    delete: remove
};