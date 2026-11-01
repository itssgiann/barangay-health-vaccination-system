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

const remove = (id, callback) => {
    db.query('DELETE FROM health_equipment WHERE equipment_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
