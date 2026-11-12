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
    // FULL OUTER JOIN emulation: all appointments + vaccination records without a matching appointment.
    // Matching is inferred from resident, vaccine and dose number; no direct appointment FK exists.
    const sql = `
        WITH dose_records AS (
            SELECT vr.record_id, vr.resident_id, vr.date_administered,
                   im.vaccine_id, im.dose_number
            FROM vaccination_records vr
            INNER JOIN immunization_milestones im ON vr.milestone_id = im.milestone_id
        ), paired AS (
            SELECT a.appointment_id,
                   COALESCE(a.resident_id, r.resident_id) AS resident_id,
                   COALESCE(a.vaccine_id, r.vaccine_id) AS vaccine_id,
                   COALESCE(a.dose_number, r.dose_number) AS dose_number,
                   a.scheduled_date, a.status AS appointment_status,
                   r.record_id, r.date_administered
            FROM appointments a
            LEFT JOIN dose_records r
              ON a.resident_id = r.resident_id
             AND a.vaccine_id = r.vaccine_id
             AND a.dose_number = r.dose_number
            UNION ALL
            SELECT a.appointment_id,
                   COALESCE(a.resident_id, r.resident_id),
                   COALESCE(a.vaccine_id, r.vaccine_id),
                   COALESCE(a.dose_number, r.dose_number),
                   a.scheduled_date, a.status,
                   r.record_id, r.date_administered
            FROM dose_records r
            LEFT JOIN appointments a
              ON a.resident_id = r.resident_id
             AND a.vaccine_id = r.vaccine_id
             AND a.dose_number = r.dose_number
            WHERE a.appointment_id IS NULL
        )
        SELECT p.*,
               CONCAT_WS(' ', res.first_name, res.last_name) AS resident_name,
               v.vaccine_name,
               CASE
                 WHEN p.appointment_id IS NULL THEN 'Vaccination with no matching appointment'
                 WHEN p.record_id IS NULL THEN 'Appointment without vaccination record'
                 ELSE 'Matched by resident, vaccine and dose'
               END AS match_status
        FROM paired p
        LEFT JOIN residents res ON p.resident_id = res.resident_id
        LEFT JOIN vaccines v ON p.vaccine_id = v.vaccine_id
        ORDER BY p.resident_id, p.scheduled_date, p.date_administered, p.record_id
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