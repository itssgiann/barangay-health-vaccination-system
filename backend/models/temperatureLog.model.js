const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM temperature_logs', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM temperature_logs WHERE log_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO temperature_logs
        (equipment_id, recorded_by, temperature_celsius,
        is_out_of_range, recorded_at)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.equipment_id,
            data.recorded_by,
            data.temperature_celsius,
            data.is_out_of_range,
            data.recorded_at
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE temperature_logs
        SET equipment_id = ?,
            recorded_by = ?,
            temperature_celsius = ?,
            is_out_of_range = ?,
            recorded_at = ?
        WHERE log_id = ?
    `;

    db.query(
        sql,
        [
            data.equipment_id,
            data.recorded_by,
            data.temperature_celsius,
            data.is_out_of_range,
            data.recorded_at,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM temperature_logs WHERE log_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
