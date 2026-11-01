
const db = require('../config/db');

const Resident = {
    getAll: async () => {
        const [rows] = await db.promise().query('SELECT * FROM residents');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM residents WHERE resident_id = ?', [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `INSERT INTO residents
            (household_id, zone_id, first_name, middle_name, last_name,
             birthdate, gender, address, contact_number, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        const values = [
            data.household_id, data.zone_id, data.first_name,
            data.middle_name ?? null, data.last_name, data.birthdate,
            data.gender, data.address ?? null, data.contact_number ?? null
        ];

        const [result] = await db.promise().query(sql, values);
        return result.insertId;
    },

    update: async (id, data) => {
        const sql = `UPDATE residents SET
            household_id = ?, zone_id = ?, first_name = ?, middle_name = ?,
            last_name = ?, birthdate = ?, gender = ?, address = ?,
            contact_number = ? WHERE resident_id = ?`;

        const values = [
            data.household_id, data.zone_id, data.first_name,
            data.middle_name ?? null, data.last_name, data.birthdate,
            data.gender, data.address ?? null, data.contact_number ?? null, id
        ];

        const [result] = await db.promise().query(sql, values);
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM residents WHERE resident_id = ?', [id]
        );
        return result.affectedRows;
    }
};

module.exports = Resident;
