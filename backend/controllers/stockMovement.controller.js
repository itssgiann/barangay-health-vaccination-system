const StockMovement = require('../models/stockMovement.model');

exports.getAll = async (req, res) => {
    try {
        const movements = await StockMovement.getAll();
        res.status(200).json(movements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const movement = await StockMovement.getById(req.params.id);
        if (!movement) return res.status(404).json({ message: 'Stock movement not found' });
        res.status(200).json(movement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByBatch = async (req, res) => {
    try {
        const movements = await StockMovement.getByBatch(req.params.batchId);
        res.status(200).json(movements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newId = await StockMovement.create(req.body);
        res.status(201).json({ message: 'Stock movement recorded successfully', movement_id: newId });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid batch_id or staff_id' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await StockMovement.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Stock movement not found' });
        res.status(200).json({ message: 'Stock movement deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};