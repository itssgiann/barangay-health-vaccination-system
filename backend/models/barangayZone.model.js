const db = require('../config/db');

const BarangayZone = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM barangay_zones');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM barangay_zones WHERE zone_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO barangay_zones (zone_name, description) VALUES (?, ?)',
            [data.zone_name, data.description]
        );
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM barangay_zones WHERE zone_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = BarangayZone;