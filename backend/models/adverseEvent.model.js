const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM adverse_events', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM adverse_events WHERE event_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO adverse_events
        (record_id, reported_by, severity, description, onset_date,
        outcome, reported_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.record_id,
            data.reported_by,
            data.severity,
            data.description,
            data.onset_date,
            data.outcome,
            data.reported_at || new Date()
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE adverse_events
        SET record_id = ?,
            reported_by = ?,
            severity = ?,
            description = ?,
            onset_date = ?,
            outcome = ?
        WHERE event_id = ?
    `;

    db.query(
        sql,
        [
            data.record_id,
            data.reported_by,
            data.severity,
            data.description,
            data.onset_date,
            data.outcome,
            id
        ],
        callback
    );
};

const getWithResidents = (callback) => {
    const sql = `
        SELECT
            ae.event_id,
            r.first_name,
            r.last_name,
            vr.date_administered,
            ae.severity,
            ae.description,
            ae.onset_date,
            ae.outcome
        FROM adverse_events ae
        INNER JOIN vaccination_records vr
            ON ae.record_id = vr.record_id
        INNER JOIN residents r
            ON vr.resident_id = r.resident_id
        ORDER BY ae.event_id
    `;

    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM adverse_events WHERE event_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getWithResidents,
    create,
    update,
    delete: remove
};
