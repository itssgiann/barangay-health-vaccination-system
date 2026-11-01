const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM immunization_milestones', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM immunization_milestones WHERE milestone_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO immunization_milestones
        (vaccine_id, dose_number, recommended_age_days,
        min_interval_days, notes)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.vaccine_id,
            data.dose_number,
            data.recommended_age_days,
            data.min_interval_days,
            data.notes
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE immunization_milestones
        SET vaccine_id = ?,
            dose_number = ?,
            recommended_age_days = ?,
            min_interval_days = ?,
            notes = ?
        WHERE milestone_id = ?
    `;

    db.query(
        sql,
        [
            data.vaccine_id,
            data.dose_number,
            data.recommended_age_days,
            data.min_interval_days,
            data.notes,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM immunization_milestones WHERE milestone_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};