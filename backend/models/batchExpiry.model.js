const db = require('../config/db');

// Show both upcoming batches AND those already expired, with remaining stock.
const getExpiring = (days, callback) => {
    const sql = `
        SELECT vb.batch_id, vb.batch_number, v.vaccine_name,
               vb.expiry_date, vb.quantity_remaining,
               CASE WHEN vb.expiry_date < CURDATE() THEN 'Expired'
                    WHEN vb.quantity_remaining = 0 THEN 'Depleted'
                    ELSE vb.status END AS status,
               DATEDIFF(vb.expiry_date, CURDATE()) AS days_left
        FROM vaccine_batches vb
        INNER JOIN vaccines v ON vb.vaccine_id = v.vaccine_id
        WHERE vb.quantity_remaining > 0
          AND (vb.expiry_date < CURDATE()
               OR vb.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY))
        ORDER BY vb.expiry_date, vb.batch_id
    `;
    db.query(sql, [days], callback);
};

const markExpired = (callback) => {
    db.query(`
        UPDATE vaccine_batches
           SET status = 'Expired'
         WHERE expiry_date < CURDATE() AND status <> 'Expired'
    `, callback);
};

// A near-expiry alert is no longer current after its batch is already expired.
const resolveOutdatedNearExpiryAlerts = (callback) => {
    db.query(`
        UPDATE alerts a
        INNER JOIN vaccine_batches vb ON a.related_id = vb.batch_id
           SET a.status = 'Resolved', a.resolved_at = NOW()
         WHERE a.alert_type = 'Near_Expiry' AND a.status = 'Open'
           AND vb.expiry_date < CURDATE()
    `, callback);
};

const createNearExpiryAlerts = (staffId, days, callback) => {
    const sql = `
        INSERT INTO alerts
        (assigned_to, alert_type, severity, message, related_id, status, created_at)
        SELECT ?, 'Near_Expiry',
               CASE WHEN DATEDIFF(vb.expiry_date, CURDATE()) <= 7 THEN 'Severe'
                    ELSE 'Moderate' END,
               CONCAT('Vaccine ', v.vaccine_name, ', batch ', vb.batch_number,
                      ', expires on ', DATE_FORMAT(vb.expiry_date, '%Y-%m-%d'),
                      '. Remaining doses: ', vb.quantity_remaining, '.'),
               vb.batch_id, 'Open', NOW()
        FROM vaccine_batches vb
        INNER JOIN vaccines v ON vb.vaccine_id = v.vaccine_id
        LEFT JOIN alerts a ON a.related_id = vb.batch_id
             AND a.alert_type = 'Near_Expiry' AND a.status = 'Open'
        WHERE vb.expiry_date >= CURDATE()
          AND vb.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
          AND vb.quantity_remaining > 0
          AND vb.status <> 'Expired'
          AND a.alert_id IS NULL
    `;
    db.query(sql, [staffId, days], callback);
};

const createExpiredAlerts = (staffId, callback) => {
    const sql = `
        INSERT INTO alerts
        (assigned_to, alert_type, severity, message, related_id, status, created_at)
        SELECT ?, 'Expired_Batch', 'Severe',
               CONCAT('EXPIRED vaccine batch: ', v.vaccine_name, ' / ', vb.batch_number,
                      '. Expiry date: ', DATE_FORMAT(vb.expiry_date, '%Y-%m-%d'),
                      '. Remaining doses: ', vb.quantity_remaining,
                      '. Do not administer expired doses.'),
               vb.batch_id, 'Open', NOW()
        FROM vaccine_batches vb
        INNER JOIN vaccines v ON vb.vaccine_id = v.vaccine_id
        LEFT JOIN alerts a ON a.related_id = vb.batch_id
             AND a.alert_type = 'Expired_Batch' AND a.status = 'Open'
        WHERE vb.expiry_date < CURDATE()
          AND vb.quantity_remaining > 0
          AND a.alert_id IS NULL
    `;
    db.query(sql, [staffId], callback);
};

module.exports = {
    getExpiring, markExpired, resolveOutdatedNearExpiryAlerts,
    createNearExpiryAlerts, createExpiredAlerts
};
