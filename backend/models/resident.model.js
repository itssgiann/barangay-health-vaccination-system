const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM residents', callback);
};

// Get resident vaccination report
const getVaccinationReport = (callback) => {
    const sql = `
        SELECT
            r.resident_id,
            CONCAT_WS(' ', r.first_name, r.middle_name, r.last_name) AS resident_name,
            vr.record_id,
            vr.date_administered,
            vr.next_due_date,
            vr.next_dose_status
        FROM residents r
        LEFT JOIN vaccination_records vr
            ON r.resident_id = vr.resident_id
        ORDER BY r.resident_id, vr.date_administered
    `;

    db.query(sql, callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM residents WHERE resident_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO residents
        (household_id, zone_id, first_name, middle_name, last_name,
        birthdate, gender, address, contact_number, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
        sql,
        [
            data.household_id,
            data.zone_id,
            data.first_name,
            data.middle_name,
            data.last_name,
            data.birthdate,
            data.gender,
            data.address,
            data.contact_number
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE residents
        SET household_id = ?,
            zone_id = ?,
            first_name = ?,
            middle_name = ?,
            last_name = ?,
            birthdate = ?,
            gender = ?,
            address = ?,
            contact_number = ?
        WHERE resident_id = ?
    `;

    db.query(
        sql,
        [
            data.household_id,
            data.zone_id,
            data.first_name,
            data.middle_name,
            data.last_name,
            data.birthdate,
            data.gender,
            data.address,
            data.contact_number,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM residents WHERE resident_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getVaccinationReport,
    getById,
    create,
    update,
    delete: remove
};
