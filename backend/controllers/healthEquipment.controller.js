const HealthEquipment = require('../models/healthEquipment.model');

exports.getAll = async (req, res) => {
    try {
        const items = await HealthEquipment.getAll();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await HealthEquipment.getById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Equipment not found' });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await HealthEquipment.create(req.body);
        res.status(201).json({ message: 'Equipment added', equipment_id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await HealthEquipment.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Equipment not found' });
        res.status(200).json({ message: 'Equipment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
