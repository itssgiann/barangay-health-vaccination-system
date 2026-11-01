const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM vaccination_records', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM vaccination_records WHERE record_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO vaccination_records
        (resident_id, batch_id, staff_id, milestone_id,
        date_administered, next_due_date, next_dose_status, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.batch_id,
            data.staff_id,
            data.milestone_id,
            data.date_administered,
            data.next_due_date,
            data.next_dose_status,
            data.remarks
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE vaccination_records
        SET resident_id = ?,
            batch_id = ?,
            staff_id = ?,
            milestone_id = ?,
            date_administered = ?,
            next_due_date = ?,
            next_dose_status = ?,
            remarks = ?
        WHERE record_id = ?
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.batch_id,
            data.staff_id,
            data.milestone_id,
            data.date_administered,
            data.next_due_date,
            data.next_dose_status,
            data.remarks,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM vaccination_records WHERE record_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
