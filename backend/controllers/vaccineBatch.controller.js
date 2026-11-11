const VaccineBatch = require('../models/vaccineBatch.model');

const sendError = (res, err) => {
    console.error('Vaccine batch database error:', err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'This batch number is already registered. Enter a unique batch number.' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: 'The selected vaccine or storage equipment does not exist.' });
    if (['ER_DATA_TOO_LONG', 'ER_TRUNCATED_WRONG_VALUE'].includes(err.code)) return res.status(400).json({ message: 'Some batch details are not valid. Check your values and dates.' });
    if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Cannot delete this batch because vaccination or stock records still reference it.' });
    return res.status(500).json({ message: 'Unable to save vaccine batch. Please contact your system administrator.' });
};

const isDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const positiveInt = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
const nonnegativeInt = value => Number.isSafeInteger(Number(value)) && Number(value) >= 0;

const validateBatch = (data) => {
    if (!positiveInt(data.vaccine_id)) return 'Select an existing vaccine.';
    if (!positiveInt(data.equipment_id)) return 'Select available storage equipment.';
    if (typeof data.batch_number !== 'string' || !data.batch_number.trim() || data.batch_number.trim().length > 50)
        return 'Enter a batch number (up to 50 characters).';
    if (!positiveInt(data.quantity_received)) return 'Doses received must be a positive whole number.';
    if (!nonnegativeInt(data.quantity_remaining)) return 'Doses remaining must be zero or a positive whole number.';
    if (Number(data.quantity_remaining) > Number(data.quantity_received))
        return 'Doses remaining cannot exceed doses received.';
    if (!isDate(data.received_date) || !isDate(data.expiry_date)) return 'Enter valid received and expiry dates.';
    if (data.expiry_date < data.received_date) return 'Expiry date cannot be earlier than the received date.';
    const allowed = ['Available', 'Quarantined', 'Depleted', 'Expired'];
    if (data.status != null && data.status !== '' && !allowed.includes(data.status))
        return 'Select Available, Quarantined, Depleted or Expired as the batch status.';
    return null;
};

const getAll = (_req, res) => VaccineBatch.getAll((err, rows) => {
    if (err) return sendError(res, err);
    return res.status(200).json(rows);
});
const getWithVaccines = (_req, res) => VaccineBatch.getWithVaccines((err, rows) => {
    if (err) return sendError(res, err);
    return res.status(200).json(rows);
});
const getById = (req, res) => VaccineBatch.getById(req.params.id, (err, rows) => {
    if (err) return sendError(res, err);
    if (!rows.length) return res.status(404).json({ message: 'Vaccine batch not found.' });
    return res.status(200).json(rows[0]);
});

const create = (req, res) => {
    const data = req.body || {};
    const problem = validateBatch(data);
    if (problem) return res.status(400).json({ message: problem });
    VaccineBatch.create(data, (err, result) => {
        if (err) return sendError(res, err);
        return res.status(201).json({ message: 'Vaccine batch added. The expiry status has been calculated from its date.', batch_id: result.insertId });
    });
};

const update = (req, res) => {
    const data = req.body || {};
    const problem = validateBatch(data);
    if (problem) return res.status(400).json({ message: problem });
    VaccineBatch.update(req.params.id, data, (err, result) => {
        if (err) return sendError(res, err);
        if (!result.affectedRows) return res.status(404).json({ message: 'Vaccine batch not found.' });
        return res.status(200).json({ message: 'Vaccine batch updated. The expiry status has been recalculated.' });
    });
};

const remove = (req, res) => VaccineBatch.delete(req.params.id, (err, result) => {
    if (err) return sendError(res, err);
    if (!result.affectedRows) return res.status(404).json({ message: 'Vaccine batch not found.' });
    return res.status(200).json({ message: 'Vaccine batch deleted successfully.' });
});

module.exports = { getAll, getById, getWithVaccines, create, update, delete: remove };
