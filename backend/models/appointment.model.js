const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM appointments', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM appointments WHERE appointment_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO appointments
        (resident_id, vaccine_id, staff_id, dose_number,
        scheduled_date, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.vaccine_id,
            data.staff_id,
            data.dose_number,
            data.scheduled_date,
            data.status || 'Scheduled',
            data.notes
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE appointments
        SET resident_id = ?,
            vaccine_id = ?,
            staff_id = ?,
            dose_number = ?,
            scheduled_date = ?,
            status = ?,
            notes = ?
        WHERE appointment_id = ?
    `;

    db.query(
        sql,
        [
            data.resident_id,
            data.vaccine_id,
            data.staff_id,
            data.dose_number,
            data.scheduled_date,
            data.status || 'Scheduled',
            data.notes,
            id
        ],
        callback
    );
};

const getWithRecords = (callback) => {
    const records = `
        SELECT
            vr.record_id,
            vr.resident_id,
            vr.date_administered,
            im.vaccine_id,
            im.dose_number
        FROM vaccination_records vr
        INNER JOIN immunization_milestones im
            ON vr.milestone_id = im.milestone_id
    `;

    const sql = `
        SELECT
            a.appointment_id,
            a.resident_id AS appointment_resident,
            a.scheduled_date,
            a.status,
            r.record_id,
            r.resident_id AS record_resident,
            r.date_administered
        FROM appointments a
        LEFT JOIN (${records}) r
            ON a.resident_id = r.resident_id
            AND a.vaccine_id = r.vaccine_id
            AND a.dose_number = r.dose_number
        UNION
        SELECT
            a.appointment_id,
            a.resident_id AS appointment_resident,
            a.scheduled_date,
            a.status,
            r.record_id,
            r.resident_id AS record_resident,
            r.date_administered
        FROM appointments a
        RIGHT JOIN (${records}) r
            ON a.resident_id = r.resident_id
            AND a.vaccine_id = r.vaccine_id
            AND a.dose_number = r.dose_number
    `;

    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM appointments WHERE appointment_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getWithRecords,
    create,
    update,
    delete: remove
};