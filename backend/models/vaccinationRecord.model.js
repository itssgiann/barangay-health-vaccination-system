
const db = require('../config/db');

const VaccinationRecord = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM vaccination_records');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM vaccination_records WHERE record_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO vaccination_records
            (resident_id, batch_id, staff_id, milestone_id,
            date_administered, next_due_date, next_dose_status, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.resident_id,
            data.batch_id,
            data.staff_id,
            data.milestone_id,
            data.date_administered,
            data.next_due_date,
            data.next_dose_status,
            data.remarks
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM vaccination_records WHERE record_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = VaccinationRecord;
