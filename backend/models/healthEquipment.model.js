const db = require('../config/db');

const HealthEquipment = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM health_equipment');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM health_equipment WHERE equipment_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const sql = `INSERT INTO health_equipment 
            (equipment_name, equipment_type, location, min_temp, max_temp, status, last_maintenance_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            data.equipment_name, data.equipment_type, data.location,
            data.min_temp, data.max_temp, data.status || 'Operational', data.last_maintenance_date
        ];
        const [result] = await db.query(sql, values);
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM health_equipment WHERE equipment_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = HealthEquipment;
