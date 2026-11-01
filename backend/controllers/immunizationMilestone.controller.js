const ImmunizationMilestone = require('../models/immunizationMilestone.model');

exports.getAll = async (req, res) => {
    try {
        const milestones = await ImmunizationMilestone.getAll();
        res.status(200).json(milestones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const milestone = await ImmunizationMilestone.getById(req.params.id);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json(milestone);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await ImmunizationMilestone.create(req.body);
        res.status(201).json({ message: 'Milestone added successfully', milestone_id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await ImmunizationMilestone.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Milestone not found' });
        res.status(200).json({ message: 'Milestone deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};