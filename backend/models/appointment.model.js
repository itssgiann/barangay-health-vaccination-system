const db = require('../config/db');

const Appointment = {

    // Get all appointments
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM appointments');
        return rows;
    },

    // Get one appointment by ID
    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM appointments WHERE appointment_id = ?',
            [id]
        );
        return rows[0];
    },

    // Add a new appointment
    create: async (data) => {
        const sql = `
            INSERT INTO appointments 
            (resident_id, vaccine_id, staff_id, dose_number, scheduled_date, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.resident_id,
            data.vaccine_id,
            data.staff_id,
            data.dose_number,
            data.scheduled_date,
            data.status || 'Scheduled',
            data.notes
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    // Delete an appointment
    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM appointments WHERE appointment_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = Appointment;
