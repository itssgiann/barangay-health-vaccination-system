const db = require('../config/db');

const Consultation = {

   
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM consultations');
        return rows;
    },

    
    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM consultations WHERE consultation_id = ?',
            [id]
        );
        return rows[0];
    },

    
    create: async (data) => {
        const sql = `
            INSERT INTO consultations
            (resident_id, staff_id, consultation_date, temperature_celsius,
            blood_pressure, pulse_rate, weight_kg, height_cm,
            chief_complaint, diagnosis, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.resident_id,
            data.staff_id,
            data.consultation_date,
            data.temperature_celsius,
            data.blood_pressure,
            data.pulse_rate,
            data.weight_kg,
            data.height_cm,
            data.chief_complaint,
            data.diagnosis,
            data.notes
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    
    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM consultations WHERE consultation_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = Consultation;
