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

const getWithVaccines = (callback) => {
    const sql = `
        SELECT
            v.vaccine_id,
            v.vaccine_name,
            vb.batch_id,
            vb.batch_number,
            vb.quantity_remaining,
            vb.expiry_date
        FROM vaccine_batches vb
        RIGHT JOIN vaccines v
            ON vb.vaccine_id = v.vaccine_id
        ORDER BY v.vaccine_id, vb.batch_id
    `;

    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM vaccine_batches WHERE batch_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getWithVaccines,
    create,
    update,
    delete: remove
};