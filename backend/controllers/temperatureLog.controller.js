const TemperatureLog = require('../models/temperatureLog.model');

exports.getAll = async (req, res) => {
    try {
        const list = await TemperatureLog.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await TemperatureLog.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Temperature log not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await TemperatureLog.create(req.body);

        res.status(201).json({
            message: 'Temperature log added',
            log_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await TemperatureLog.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Temperature log not found' });
        }

        res.status(200).json({ message: 'Temperature log deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
