const db = require('../config/db');


const getAll = (callback) => {
    const sql = `
        SELECT vb.batch_id, vb.vaccine_id, vb.equipment_id, vb.batch_number,
               vb.quantity_received, vb.quantity_remaining,
               vb.received_date, vb.expiry_date,
               CASE WHEN vb.expiry_date < CURDATE() THEN 'Expired'
                    WHEN vb.quantity_remaining = 0 THEN 'Depleted'
                    ELSE vb.status END AS status,
               v.vaccine_name, he.equipment_name,
               DATEDIFF(vb.expiry_date, CURDATE()) AS days_left
        FROM vaccine_batches vb
        INNER JOIN vaccines v ON vb.vaccine_id = v.vaccine_id
        INNER JOIN health_equipment he ON vb.equipment_id = he.equipment_id
        ORDER BY vb.expiry_date, vb.batch_id
    `;
    db.query(sql, callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM vaccine_batches WHERE batch_id = ?', [id], callback);
};


const create = (data, callback) => {
    const sql = `
        INSERT INTO vaccine_batches
        (vaccine_id, equipment_id, batch_number, quantity_received,
         quantity_remaining, received_date, expiry_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?,
            CASE WHEN ? < CURDATE() THEN 'Expired'
                 WHEN ? = 0 THEN 'Depleted'
                 ELSE ? END)
    `;
    db.query(sql, [
        data.vaccine_id, data.equipment_id, data.batch_number,
        data.quantity_received, data.quantity_remaining, data.received_date,
        data.expiry_date, data.expiry_date, data.quantity_remaining,
        data.status || 'Available'
    ], callback);
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE vaccine_batches
        SET vaccine_id = ?, equipment_id = ?, batch_number = ?,
            quantity_received = ?, quantity_remaining = ?, received_date = ?,
            expiry_date = ?,
            status = CASE WHEN ? < CURDATE() THEN 'Expired'
                          WHEN ? = 0 THEN 'Depleted'
                          ELSE ? END
        WHERE batch_id = ?
    `;
    db.query(sql, [
        data.vaccine_id, data.equipment_id, data.batch_number,
        data.quantity_received, data.quantity_remaining, data.received_date,
        data.expiry_date, data.expiry_date, data.quantity_remaining,
        data.status || 'Available', id
    ], callback);
};


const getWithVaccines = (callback) => {
    const sql = `
        SELECT v.vaccine_id, v.vaccine_name, v.total_doses_required,
               vb.batch_id, vb.batch_number, vb.quantity_received,
               vb.quantity_remaining, vb.expiry_date,
               he.equipment_name,
               CASE WHEN vb.batch_id IS NULL THEN 'No batch recorded'
                    WHEN vb.expiry_date < CURDATE() THEN 'Expired'
                    WHEN vb.quantity_remaining = 0 THEN 'Depleted'
                    ELSE vb.status END AS batch_status,
               DATEDIFF(vb.expiry_date, CURDATE()) AS days_left
        FROM vaccine_batches vb
        RIGHT JOIN vaccines v ON vb.vaccine_id = v.vaccine_id
        LEFT JOIN health_equipment he ON vb.equipment_id = he.equipment_id
        ORDER BY v.vaccine_name, vb.expiry_date, vb.batch_id
    `;
    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM vaccine_batches WHERE batch_id = ?', [id], callback);
};

module.exports = { getAll, getById, getWithVaccines, create, update, delete: remove };
