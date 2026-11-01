const MedicalStaff = require('../models/medicalStaff.model');

exports.getAll = async (req, res) => {
    try {
        const list = await MedicalStaff.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await MedicalStaff.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Medical staff not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await MedicalStaff.create(req.body);

        res.status(201).json({
            message: 'Medical staff added',
            staff_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await MedicalStaff.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Medical staff not found' });
        }

        res.status(200).json({ message: 'Medical staff deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};