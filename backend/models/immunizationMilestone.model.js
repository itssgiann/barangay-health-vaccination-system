const db = require('../config/db');

const ImmunizationMilestone = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM immunization_milestones');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM immunization_milestones WHERE milestone_id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const sql = `INSERT INTO immunization_milestones
            (vaccine_id, dose_number, recommended_age_days, min_interval_days, notes)
            VALUES (?, ?, ?, ?, ?)`;
        const values = [
            data.vaccine_id, data.dose_number, data.recommended_age_days,
            data.min_interval_days, data.notes || null
        ];
        const [result] = await db.query(sql, values);
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM immunization_milestones WHERE milestone_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = ImmunizationMilestone; 