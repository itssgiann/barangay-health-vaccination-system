const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM vaccine_batches', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM vaccine_batches WHERE batch_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO vaccine_batches
        (vaccine_id, equipment_id, batch_number, quantity_received,
        quantity_remaining, received_date, expiry_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.vaccine_id,
            data.equipment_id,
            data.batch_number,
            data.quantity_received,
            data.quantity_remaining,
            data.received_date,
            data.expiry_date,
            data.status || 'Available'
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE vaccine_batches
        SET vaccine_id = ?,
            equipment_id = ?,
            batch_number = ?,
            quantity_received = ?,
            quantity_remaining = ?,
            received_date = ?,
            expiry_date = ?,
            status = ?
        WHERE batch_id = ?
    `;

    db.query(
        sql,
        [
            data.vaccine_id,
            data.equipment_id,
            data.batch_number,
            data.quantity_received,
            data.quantity_remaining,
            data.received_date,
            data.expiry_date,
            data.status || 'Available',
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM vaccine_batches WHERE batch_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};