const db = require('../config/db');

const User = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE user_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO users
            (staff_id, username, password_hash, role, is_active)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.staff_id,
            data.username,
            data.password_hash,
            data.role,
            data.is_active ?? true
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM users WHERE user_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = User;