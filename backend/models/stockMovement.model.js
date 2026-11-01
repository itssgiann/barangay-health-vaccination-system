const db = require('../config/db');

const StockMovement = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM inventory_stock_movements');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM inventory_stock_movements WHERE movement_id = ?', [id]);
        return rows[0];
    },
    getByBatch: async (batchId) => {
        const [rows] = await db.query(
            'SELECT * FROM inventory_stock_movements WHERE batch_id = ? ORDER BY movement_date DESC',
            [batchId]
        );
        return rows;
    },
    create: async (data) => {
        const sql = `INSERT INTO inventory_stock_movements
            (batch_id, staff_id, movement_type, quantity, remarks, movement_date)
            VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            data.batch_id, data.staff_id, data.movement_type, data.quantity,
            data.remarks || null,
            data.movement_date || new Date()
        ];
        const [result] = await db.query(sql, values);
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM inventory_stock_movements WHERE movement_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = StockMovement;