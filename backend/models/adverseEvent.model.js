const db = require('../config/db');

const AdverseEvent = {
    getAll: async () => {
        const [rows] = await db.promise().query(
            'SELECT * FROM adverse_events'
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM adverse_events WHERE event_id = ?',
            [id]
        );
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.promise().query(
            `INSERT INTO adverse_events
            (record_id, reported_by, severity, description, onset_date, outcome, reported_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.record_id,
                data.reported_by,
                data.severity,
                data.description,
                data.onset_date,
                data.outcome,
                data.reported_at
            ]
        );

        return result.insertId;
    },

    delete: async (id) => {
        const [result] = await db.promise().query(
            'DELETE FROM adverse_events WHERE event_id = ?',
            [id]
        );

        return result.affectedRows;
    }
};

module.exports = AdverseEvent;
