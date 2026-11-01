const AdverseEvent = require('../models/adverseEvent.model');

const getAll = (req, res) => {
    AdverseEvent.getAll((err, results) => {
        if (err) {
            console.log('ADVERSE EVENT ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    AdverseEvent.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('ADVERSE EVENT ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Adverse event not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const create = (req, res) => {
    const {
        record_id,
        reported_by,
        severity,
        description,
        onset_date,
        outcome,
        reported_at
    } = req.body;

    if (!record_id || !reported_by || !severity || !description) {
        return res.status(400).json({
            message: 'record_id, reported_by, severity and description are required'
        });
    }

    AdverseEvent.create(
        {
            record_id,
            reported_by,
            severity,
            description,
            onset_date,
            outcome,
            reported_at
        },
        (err, result) => {
            if (err) {
                console.log('ADVERSE EVENT ERROR:', err);

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
                message: 'Adverse event added',
                event_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        record_id,
        reported_by,
        severity,
        description,
        onset_date,
        outcome,
        reported_at
    } = req.body;

    if (!record_id || !reported_by || !severity || !description) {
        return res.status(400).json({
            message: 'record_id, reported_by, severity and description are required'
        });
    }

    AdverseEvent.update(
        req.params.id,
        {
            record_id,
            reported_by,
            severity,
            description,
            onset_date,
            outcome
        },
        (err, result) => {
            if (err) {
                console.log('ADVERSE EVENT ERROR:', err);

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
                    message: 'Adverse event not found'
                });
            }

            res.status(200).json({
                message: 'Adverse event updated'
            });
        }
    );
};

const remove = (req, res) => {
    AdverseEvent.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('ADVERSE EVENT ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Adverse event not found'
            });
        }

        res.status(200).json({
            message: 'Adverse event deleted'
        });
    });
};

const getAdverseEventsWithResidentDetails = (req, res) => {
    AdverseEvent.getAdverseEventsWithResidentDetails((err, results) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while retrieving adverse event details."
            });
        }

        res.status(200).json(results);
    });
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove,
    getAdverseEventsWithResidentDetails
};
