const db = require('../config/db');

const TemperatureLog = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM temperature_logs');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM temperature_logs WHERE log_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO temperature_logs
            (equipment_id, recorded_by, temperature_celsius,
            is_out_of_range, recorded_at)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.equipment_id,
            data.recorded_by,
            data.temperature_celsius,
            data.is_out_of_range,
            data.recorded_at
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM temperature_logs WHERE log_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = TemperatureLog;
