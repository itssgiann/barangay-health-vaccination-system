const db = require('../config/db');

const VaccineBatch = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM vaccine_batches');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM vaccine_batches WHERE batch_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const sql = `INSERT INTO vaccine_batches 
            (vaccine_id, equipment_id, batch_number, quantity_received, quantity_remaining, received_date, expiry_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            data.vaccine_id, data.equipment_id, data.batch_number, data.quantity_received,
            data.quantity_remaining, data.received_date, data.expiry_date, data.status || 'Available'
        ];
        const [result] = await db.query(sql, values);
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM vaccine_batches WHERE batch_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = VaccineBatch;