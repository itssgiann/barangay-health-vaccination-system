const db = require('../config/db');

const Alert = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM alerts');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM alerts WHERE alert_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const sql = `
            INSERT INTO alerts
            (assigned_to, alert_type, severity, message,
            related_id, status, created_at, resolved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.assigned_to,
            data.alert_type,
            data.severity,
            data.message,
            data.related_id,
            data.status,
            data.created_at,
            data.resolved_at
        ];

        const [result] = await db.query(sql, values);
        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM alerts WHERE alert_id = ?',
            [id]
        );
        return result.affectedRows;
    }

};

module.exports = Alert;
