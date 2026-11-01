const Appointment = require('../models/appointment.model');

exports.getAll = async (req, res) => {
    try {
        const list = await Appointment.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await Appointment.getById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await Appointment.create(req.body);
        res.status(201).json({ message: 'Appointment scheduled', appointment_id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Appointment.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
