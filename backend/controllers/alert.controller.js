const Alert = require('../models/alert.model');

exports.getAll = async (req, res) => {
    try {
        const list = await Alert.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await Alert.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await Alert.create(req.body);

        res.status(201).json({
            message: 'Alert created',
            alert_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Alert.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.status(200).json({ message: 'Alert deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
