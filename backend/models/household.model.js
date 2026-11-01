const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM households', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM households WHERE household_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO households (zone_id, household_name, address)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [data.zone_id, data.household_name, data.address], callback);
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE households
        SET zone_id = ?, household_name = ?, address = ?
        WHERE household_id = ?
    `;
    db.query(sql, [data.zone_id, data.household_name, data.address, id], callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM households WHERE household_id = ?', [id], callback);
};

module.exports = { getAll, getById, create, update, delete: remove };
