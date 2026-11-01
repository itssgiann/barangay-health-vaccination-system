const BarangayZone = require('../models/barangayZone.model');

exports.getAll = async (req, res) => {
    try {
        const zones = await BarangayZone.getAll();
        res.status(200).json(zones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const zone = await BarangayZone.getById(req.params.id);
        if (!zone) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json(zone);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await BarangayZone.create(req.body);
        res.status(201).json({ message: 'Zone created', zone_id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await BarangayZone.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json({ message: 'Zone deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};