const VaccineBatch = require('../models/vaccineBatch.model');

exports.getAll = async (req, res) => {
    try {
        const batches = await VaccineBatch.getAll();
        res.status(200).json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const batch = await VaccineBatch.getById(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        res.status(200).json(batch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await VaccineBatch.create(req.body);
        res.status(201).json({ message: 'Batch added successfully', batch_id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await VaccineBatch.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Batch not found' });
        res.status(200).json({ message: 'Batch deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};