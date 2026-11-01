const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM inventory_stock_movements', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM inventory_stock_movements WHERE movement_id = ?', [id], callback);
};

const getByBatch = (batchId, callback) => {
    db.query(
        'SELECT * FROM inventory_stock_movements WHERE batch_id = ? ORDER BY movement_date DESC',
        [batchId],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO inventory_stock_movements
        (batch_id, staff_id, movement_type, quantity, remarks,
        movement_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.batch_id,
            data.staff_id,
            data.movement_type,
            data.quantity,
            data.remarks,
            data.movement_date || new Date()
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE inventory_stock_movements
        SET batch_id = ?,
            staff_id = ?,
            movement_type = ?,
            quantity = ?,
            remarks = ?
        WHERE movement_id = ?
    `;

    db.query(
        sql,
        [
            data.batch_id,
            data.staff_id,
            data.movement_type,
            data.quantity,
            data.remarks,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM inventory_stock_movements WHERE movement_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getByBatch,
    create,
    update,
    delete: remove
};  