
const Vaccine = require('../models/vaccine.model');

function validId(id) {
    return /^[1-9]\d*$/.test(String(id));
}

function validateVaccine(data) {
    if (!data || typeof data.vaccine_name !== 'string' ||
        !data.vaccine_name.trim() || data.vaccine_name.trim().length > 100) {
        return 'vaccine_name is required (maximum 100 characters)';
    }

    if (!Number.isInteger(data.total_doses_required) ||
        data.total_doses_required < 1) {
        return 'total_doses_required must be a positive whole number';
    }

    if (data.description != null &&
        (typeof data.description !== 'string' ||
        data.description.length > 255)) {
        return 'description must be text with 255 characters or fewer';
    }

    for (const field of ['storage_temp_min', 'storage_temp_max']) {
        const value = data[field];

        if (value != null &&
            (typeof value !== 'number' || !Number.isFinite(value) ||
            value < -999.9 || value > 999.9)) {
            return `${field} must be a valid temperature number`;
        }
    }

    if (data.storage_temp_min != null &&
        data.storage_temp_max != null &&
        data.storage_temp_min > data.storage_temp_max) {
        return 'Minimum temperature cannot exceed maximum temperature';
    }

    return null;
}

function sendError(res, err) {
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Vaccine name already exists'
        });
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
            message: 'Vaccine has related records'
        });
    }

    console.error('Vaccine error:', err.code || err.message);
    return res.status(500).json({ message: 'Server error' });
}

exports.getAll = async (req, res) => {
    try {
        const vaccines = await Vaccine.getAll();
        return res.status(200).json(vaccines);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.getById = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid vaccine ID' });
    }

    try {
        const vaccine = await Vaccine.getById(req.params.id);

        if (!vaccine) {
            return res.status(404).json({
                message: 'Vaccine not found'
            });
        }

        return res.status(200).json(vaccine);
    } catch (err) {
        return sendError(res, err);
    }
};

exports.create = async (req, res) => {
    const data = req.body || {};
    const error = validateVaccine(data);

    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const id = await Vaccine.create(data);
        return res.status(201).json({
            message: 'Vaccine added',
            vaccine_id: id
        });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.update = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid vaccine ID' });
    }

    const data = req.body || {};
    const error = validateVaccine(data);

    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const updated = await Vaccine.update(req.params.id, data);

        if (!updated) {
            return res.status(404).json({
                message: 'Vaccine not found'
            });
        }

        return res.status(200).json({
            message: 'Vaccine updated'
        });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.delete = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid vaccine ID' });
    }

    try {
        const deleted = await Vaccine.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Vaccine not found'
            });
        }

        return res.status(200).json({
            message: 'Vaccine deleted'
        });
    } catch (err) {
        return sendError(res, err);
    }
};
