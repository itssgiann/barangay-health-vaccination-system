const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM barangay_zones', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM barangay_zones WHERE zone_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO barangay_zones
        (zone_name, description)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            data.zone_name,
            data.description
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE barangay_zones
        SET zone_name = ?,
            description = ?
        WHERE zone_id = ?
    `;

    db.query(
        sql,
        [
            data.zone_name,
            data.description,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM barangay_zones WHERE zone_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};