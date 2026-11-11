const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM health_equipment', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM health_equipment WHERE equipment_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO health_equipment
        (equipment_name, equipment_type, location, min_temp, max_temp,
        status, last_maintenance_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.equipment_name,
            data.equipment_type,
            data.location,
            data.min_temp,
            data.max_temp,
            data.status || 'Operational',
            data.last_maintenance_date
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE health_equipment
        SET equipment_name = ?,
            equipment_type = ?,
            location = ?,
            min_temp = ?,
            max_temp = ?,
            status = ?,
            last_maintenance_date = ?
        WHERE equipment_id = ?
    `;

    db.query(
        sql,
        [
            data.equipment_name,
            data.equipment_type,
            data.location,
            data.min_temp,
            data.max_temp,
            data.status || 'Operational',
            data.last_maintenance_date,
            id
        ],
        callback
    );
};

const getWithLogs = (callback) => {
    const sql = `
        SELECT he.equipment_id, he.equipment_name, he.location,
               he.min_temp AS minimum_safe_temperature_celsius,
               he.max_temp AS maximum_safe_temperature_celsius,
               tl.log_id, tl.temperature_celsius, tl.is_out_of_range,
               tl.recorded_at,
               CONCAT_WS(' ', ms.first_name, ms.last_name) AS recorded_by_name
        FROM health_equipment he
        LEFT JOIN temperature_logs tl ON he.equipment_id = tl.equipment_id
        LEFT JOIN medical_staff ms ON tl.recorded_by = ms.staff_id
        ORDER BY he.equipment_id, tl.recorded_at DESC
    `;
    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM health_equipment WHERE equipment_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getWithLogs,
    create,
    update,
    delete: remove
};
