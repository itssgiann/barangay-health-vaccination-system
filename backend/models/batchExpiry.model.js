
const db = require('../config/db');

const getExpiring = (days, callback) => {
    const sql = `
        SELECT
            vb.batch_id,
            vb.batch_number,
            v.vaccine_name,
            vb.expiry_date,
            vb.quantity_remaining,
            vb.status,
            DATEDIFF(vb.expiry_date, CURDATE()) AS days_left
        FROM vaccine_batches vb
        INNER JOIN vaccines v
            ON vb.vaccine_id = v.vaccine_id
        WHERE vb.expiry_date >= CURDATE()
            AND vb.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
            AND vb.status <> 'Expired'
        ORDER BY vb.expiry_date
    `;

    db.query(sql, [days], callback);
};

const markExpired = (callback) => {
    const sql = `
        UPDATE vaccine_batches
        SET status = 'Expired'
        WHERE expiry_date < CURDATE()
            AND status <> 'Expired'
    `;

    db.query(sql, callback);
};

const createNearExpiryAlerts = (staffId, days, callback) => {
    const sql = `
        INSERT INTO alerts
        (assigned_to, alert_type, severity, message,
        related_id, status, created_at)
        SELECT
            ?,
            'Near_Expiry',
            CASE
                WHEN DATEDIFF(vb.expiry_date, CURDATE()) <= 7 THEN 'Severe'
                ELSE 'Moderate'
            END,
            CONCAT('Batch ', vb.batch_number, ' expires on ', vb.expiry_date),
            vb.batch_id,
            'Open',
            NOW()
        FROM vaccine_batches vb
        LEFT JOIN alerts a
            ON a.related_id = vb.batch_id
            AND a.alert_type = 'Near_Expiry'
            AND a.status = 'Open'
        WHERE vb.expiry_date >= CURDATE()
            AND vb.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
            AND vb.status <> 'Expired'
            AND vb.quantity_remaining > 0
            AND a.alert_id IS NULL
    `;

    db.query(sql, [staffId, days], callback);
};

const createExpiredAlerts = (staffId, callback) => {
    const sql = `
        INSERT INTO alerts
        (assigned_to, alert_type, severity, message,
        related_id, status, created_at)
        SELECT
            ?,
            'Near_Expiry',
            'Severe',
            CONCAT('Batch ', vb.batch_number, ' expired on ', vb.expiry_date),
            vb.batch_id,
            'Open',
            NOW()
        FROM vaccine_batches vb
        LEFT JOIN alerts a
            ON a.related_id = vb.batch_id
            AND a.alert_type = 'Near_Expiry'
            AND a.status = 'Open'
        WHERE vb.expiry_date < CURDATE()
            AND vb.quantity_remaining > 0
            AND a.alert_id IS NULL
    `;

    db.query(sql, [staffId], callback);
};

module.exports = {
    getExpiring,
    markExpired,
    createNearExpiryAlerts,
    createExpiredAlerts
};
