
const db = require('../config/db');

const Vaccine = {
    getAll: async () => {
        const [rows] = await db.promise().query(
            'SELECT * FROM vaccines ORDER BY vaccine_id'
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM vaccines WHERE vaccine_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `INSERT INTO vaccines
            (vaccine_name, description, total_doses_required,
             storage_temp_min, storage_temp_max)
            VALUES (?, ?, ?, ?, ?)`;

        const values = [
            data.vaccine_name.trim(),
            data.description ?? null,
            data.total_doses_required,
            data.storage_temp_min ?? null,
            data.storage_temp_max ?? null
        ];

        const [result] = await db.promise().query(sql, values);
        return result.insertId;
    },

    update: async (id, data) => {
        const sql = `UPDATE vaccines SET
            vaccine_name = ?, description = ?,
            total_doses_required = ?, storage_temp_min = ?,
            storage_temp_max = ?
            WHERE vaccine_id = ?`;

        const values = [
            data.vaccine_name.trim(),
            data.description ?? null,
            data.total_doses_required,
            data.storage_temp_min ?? null,
            data.storage_temp_max ?? null,
            id
        ];

        const [result] = await db.promise().query(sql, values);
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM vaccines WHERE vaccine_id = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = Vaccine;
