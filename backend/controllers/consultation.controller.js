const Consultation = require('../models/consultation.model');


exports.getAll = async (req, res) => {
    try {
        const list = await Consultation.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getById = async (req, res) => {
    try {
        const item = await Consultation.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.create = async (req, res) => {
    try {
        const newId = await Consultation.create(req.body);

        res.status(201).json({
            message: 'Consultation created',
            consultation_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.delete = async (req, res) => {
    try {
        const deleted = await Consultation.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json({ message: 'Consultation deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

