const db = require('../config/db');

const Household = {
    getAll: async () => {
        const [rows] = await db.promise().query(
            'SELECT * FROM households'
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM households WHERE household_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO households (zone_id, household_name, address)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.promise().query(sql, [
            data.zone_id,
            data.household_name,
            data.address
        ]);

        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM households WHERE household_id = ?',
            [id]
        );

        return result.affectedRows;
    }
};

module.exports = Household;
