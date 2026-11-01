const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM consultations', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM consultations WHERE consultation_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO consultations
        (resident_id, staff_id, consultation_date,
        temperature_celsius, blood_pressure, pulse_rate, weight_kg,
        height_cm, chief_complaint, diagnosis, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.staff_id,
            data.consultation_date,
            data.temperature_celsius,
            data.blood_pressure,
            data.pulse_rate,
            data.weight_kg,
            data.height_cm,
            data.chief_complaint,
            data.diagnosis,
            data.notes
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE consultations
        SET resident_id = ?,
            staff_id = ?,
            consultation_date = ?,
            temperature_celsius = ?,
            blood_pressure = ?,
            pulse_rate = ?,
            weight_kg = ?,
            height_cm = ?,
            chief_complaint = ?,
            diagnosis = ?,
            notes = ?
        WHERE consultation_id = ?
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.staff_id,
            data.consultation_date,
            data.temperature_celsius,
            data.blood_pressure,
            data.pulse_rate,
            data.weight_kg,
            data.height_cm,
            data.chief_complaint,
            data.diagnosis,
            data.notes,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM consultations WHERE consultation_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};