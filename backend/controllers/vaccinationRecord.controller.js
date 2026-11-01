const VaccinationRecord = require('../models/vaccinationRecord.model');

exports.getAll = async (req, res) => {
    try {
        const list = await VaccinationRecord.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await VaccinationRecord.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await VaccinationRecord.create(req.body);

        res.status(201).json({
            message: 'Vaccination record created',
            record_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await VaccinationRecord.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }

        res.status(200).json({ message: 'Vaccination record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
