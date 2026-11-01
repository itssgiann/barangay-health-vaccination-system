const User = require('../models/user.model');

exports.getAll = async (req, res) => {
    try {
        const list = await User.getAll();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await User.getById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await User.create(req.body);

        res.status(201).json({
            message: 'User created',
            user_id: newId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};