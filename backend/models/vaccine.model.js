const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM vaccines ORDER BY vaccine_id', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM vaccines WHERE vaccine_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO vaccines
        (vaccine_name, description, total_doses_required,
        storage_temp_min, storage_temp_max)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.vaccine_name,
            data.description,
            data.total_doses_required,
            data.storage_temp_min,
            data.storage_temp_max
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE vaccines
        SET vaccine_name = ?, description = ?, total_doses_required = ?,
        storage_temp_min = ?, storage_temp_max = ?
        WHERE vaccine_id = ?
    `;

    db.query(
        sql,
        [
            data.vaccine_name,
            data.description,
            data.total_doses_required,
            data.storage_temp_min,
            data.storage_temp_max,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM vaccines WHERE vaccine_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
