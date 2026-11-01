const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM appointments', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM appointments WHERE appointment_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO appointments
        (resident_id, vaccine_id, staff_id, dose_number,
        scheduled_date, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.vaccine_id,
            data.staff_id,
            data.dose_number,
            data.scheduled_date,
            data.status || 'Scheduled',
            data.notes
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE appointments
        SET resident_id = ?,
            vaccine_id = ?,
            staff_id = ?,
            dose_number = ?,
            scheduled_date = ?,
            status = ?,
            notes = ?
        WHERE appointment_id = ?
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.vaccine_id,
            data.staff_id,
            data.dose_number,
            data.scheduled_date,
            data.status || 'Scheduled',
            data.notes,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM appointments WHERE appointment_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
