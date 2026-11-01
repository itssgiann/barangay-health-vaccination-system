const AdverseEvent = require('../models/adverseEvent.model');

exports.getAll = async (req, res) => {
    try {
        const events = await AdverseEvent.getAll();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const event = await AdverseEvent.getById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: 'Adverse event not found'
            });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await AdverseEvent.create(req.body);

        res.status(201).json({
            message: 'Adverse event added',
            event_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await AdverseEvent.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Adverse event not found'
            });
        }

        res.status(200).json({
            message: 'Adverse event deleted'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
