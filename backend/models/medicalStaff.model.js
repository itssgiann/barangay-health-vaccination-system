const db = require('../config/db');

const MedicalStaff = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM medical_staff');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM medical_staff WHERE staff_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO medical_staff
            (zone_id, first_name, last_name, staff_role,
            license_number, contact_number, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.zone_id,
            data.first_name,
            data.last_name,
            data.staff_role,
            data.license_number,
            data.contact_number,
            data.is_active ?? true
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM medical_staff WHERE staff_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = MedicalStaff;