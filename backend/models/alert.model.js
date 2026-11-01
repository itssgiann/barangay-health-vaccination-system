const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM alerts', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM alerts WHERE alert_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO alerts
        (assigned_to, alert_type, severity, message, related_id,
        status, created_at, resolved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.assigned_to,
            data.alert_type,
            data.severity,
            data.message,
            data.related_id,
            data.status,
            data.created_at || new Date(),
            data.resolved_at
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE alerts
        SET assigned_to = ?,
            alert_type = ?,
            severity = ?,
            message = ?,
            related_id = ?,
            status = ?,
            resolved_at = ?
        WHERE alert_id = ?
    `;

    db.query(
        sql,
        [
            data.assigned_to,
            data.alert_type,
            data.severity,
            data.message,
            data.related_id,
            data.status,
            data.resolved_at,
            id
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query('DELETE FROM alerts WHERE alert_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: remove
};
