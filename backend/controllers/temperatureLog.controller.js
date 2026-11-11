const TemperatureLog = require('../models/temperatureLog.model');
const HealthEquipment = require('../models/healthEquipment.model');

const sendError = (res, err) => {
    console.error('Temperature log error:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: 'Select an existing equipment item and staff member.' });
    if (['ER_DATA_TOO_LONG', 'ER_TRUNCATED_WRONG_VALUE'].includes(err.code)) return res.status(400).json({ message: 'Some log details are invalid. Review the form.' });
    return res.status(500).json({ message: 'Unable to save temperature reading.' });
};

const getAll = (_req, res) => TemperatureLog.getAll((err, rows) => err ? sendError(res, err) : res.json(rows));
const getById = (req, res) => TemperatureLog.getById(req.params.id, (err, rows) => {
    if (err) return sendError(res, err);
    return rows.length ? res.json(rows[0]) : res.status(404).json({ message: 'Temperature reading not found.' });
});

// The server derives out-of-range status from stored equipment temperature thresholds.
const save = (req, res, editing) => {
    const body = req.body || {};
    const equipmentId = Number(body.equipment_id);
    const staffId = Number(body.recorded_by);
    const temperature = Number(body.temperature_celsius);
    if (!Number.isSafeInteger(equipmentId) || equipmentId < 1 ||
        !Number.isSafeInteger(staffId) || staffId < 1 ||
        body.temperature_celsius === null || body.temperature_celsius === '' ||
        !Number.isFinite(temperature) || temperature < -99.9 || temperature > 99.9 ||
        typeof body.recorded_at !== 'string' || !body.recorded_at.trim()) {
        return res.status(400).json({ message: 'Select equipment and staff, enter a valid temperature in °C, and choose the recorded date and time.' });
    }

    HealthEquipment.getById(equipmentId, (lookupError, rows) => {
        if (lookupError) return sendError(res, lookupError);
        if (!rows.length) return res.status(400).json({ message: 'Selected equipment was not found.' });
        const equipment = rows[0];
        if (equipment.min_temp == null || equipment.max_temp == null) {
            return res.status(400).json({ message: 'Set minimum and maximum safe temperatures for this equipment before recording readings.' });
        }
        const min = Number(equipment.min_temp);
        const max = Number(equipment.max_temp);
        if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
            return res.status(400).json({ message: 'The equipment has invalid safe temperature limits.' });
        }
        const outOfRange = temperature < min || temperature > max;
        const data = {
            equipment_id: equipmentId,
            recorded_by: staffId,
            temperature_celsius: temperature,
            is_out_of_range: outOfRange,
            recorded_at: body.recorded_at
        };
        const callback = (err, result) => {
            if (err) return sendError(res, err);
            if (editing && !result.affectedRows) return res.status(404).json({ message: 'Temperature reading not found.' });
            return res.status(editing ? 200 : 201).json({
                message: outOfRange
                    ? 'Temperature reading saved: outside the equipment safe range.'
                    : 'Temperature reading saved: within the equipment safe range.',
                ...(editing ? {} : { log_id: result.insertId }),
                is_out_of_range: outOfRange,
                range_celsius: { min, max }
            });
        };
        if (editing) TemperatureLog.update(req.params.id, data, callback);
        else TemperatureLog.create(data, callback);
    });
};
const create = (req, res) => save(req, res, false);
const update = (req, res) => save(req, res, true);
const remove = (req, res) => TemperatureLog.delete(req.params.id, (err, result) => {
    if (err) return sendError(res, err);
    if (!result.affectedRows) return res.status(404).json({ message: 'Temperature reading not found.' });
    return res.json({ message: 'Temperature reading deleted.' });
});

module.exports = { getAll, getById, create, update, delete: remove };
