const Household = require('../models/household.model');

exports.getAll = async (req, res) => {
    try {
        const households = await Household.getAll();
        res.status(200).json(households);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const household = await Household.getById(req.params.id);

        if (!household) {
            return res.status(404).json({
                message: 'Household not found'
            });
        }

        res.status(200).json(household);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await Household.create(req.body);

        res.status(201).json({
            message: 'Household added',
            household_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Household.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Household not found'
            });
        }

        res.status(200).json({
            message: 'Household deleted'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
