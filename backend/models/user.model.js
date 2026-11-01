const db = require('../config/db');

const getAll = (callback) => {
    db.query(
        'SELECT user_id, staff_id, username, role, is_active, created_at FROM users',
        callback
    );
};

const getById = (id, callback) => {
    db.query(
        'SELECT user_id, staff_id, username, role, is_active, created_at FROM users WHERE user_id = ?',
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO users
        (staff_id, username, password_hash, role, is_active)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.staff_id,
            data.username,
            data.password_hash,
            data.role,
            data.is_active === undefined ? true : data.is_active
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const isActive = data.is_active === undefined ? true : data.is_active;

    if (data.password_hash) {
        const sqlWithPassword = `
            UPDATE users
            SET staff_id = ?, username = ?, role = ?, is_active = ?, password_hash = ?
            WHERE user_id = ?
        `;

        db.query(
            sqlWithPassword,
            [data.staff_id, data.username, data.role, isActive, data.password_hash, id],
            callback
        );
    } else {
        const sql = `
            UPDATE users
            SET staff_id = ?, username = ?, role = ?, is_active = ?
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [data.staff_id, data.username, data.role, isActive, id],
            callback
        );
    }
};

const remove = (id, callback) => {
    db.query('DELETE FROM users WHERE user_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
