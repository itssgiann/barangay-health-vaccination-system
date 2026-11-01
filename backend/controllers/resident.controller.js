
const Resident = require('../models/resident.model');

function validId(value) {
    return /^[1-9]\d*$/.test(String(value));
}

function validateResident(data) {
    const required = [
        'household_id', 'zone_id', 'first_name',
        'last_name', 'birthdate', 'gender'
    ];

    for (const field of required) {
        if (data[field] == null || String(data[field]).trim() === '') {
            return `Missing ${field}`;
        }
    }

    if (!validId(data.household_id) || !validId(data.zone_id)) {
        return 'Invalid household_id or zone_id';
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.birthdate))) {
        return 'birthdate must use YYYY-MM-DD';
    }

    if (String(data.gender).length > 10) {
        return 'gender is too long';
    }

    return null;
}

function sendError(res, err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            message: 'Invalid household or zone reference'
        });
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
            message: 'Resident has related records'
        });
    }

    return res.status(500).json({ message: 'Server error' });
}

exports.getAll = async (req, res) => {
    try {
        const residents = await Resident.getAll();
        return res.status(200).json(residents);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.getById = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid resident ID' });
    }

    try {
        const resident = await Resident.getById(req.params.id);

        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        return res.status(200).json(resident);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.create = async (req, res) => {
    const data = req.body || {};
    const error = validateResident(data);

    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const id = await Resident.create(data);
        return res.status(201).json({
            message: 'Resident added',
            resident_id: id
        });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.update = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid resident ID' });
    }

    const data = req.body || {};
    const error = validateResident(data);

    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const updated = await Resident.update(req.params.id, data);

        if (!updated) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        return res.status(200).json({ message: 'Resident updated' });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.delete = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid resident ID' });
    }

    try {
        const deleted = await Resident.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        return res.status(200).json({ message: 'Resident deleted' });
    } catch (err) {
        return sendError(res, err);
    }
};

