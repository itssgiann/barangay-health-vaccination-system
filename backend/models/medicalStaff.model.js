const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM medical_staff', callback);
};

const getById = (id, callback) => {
    db.query('SELECT * FROM medical_staff WHERE staff_id = ?', [id], callback);
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO medical_staff
        (zone_id, first_name, last_name, staff_role, license_number,
        contact_number, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.zone_id,
            data.first_name,
            data.last_name,
            data.staff_role,
            data.license_number,
            data.contact_number,
            data.is_active === undefined ? true : data.is_active
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE medical_staff
        SET zone_id = ?,
            first_name = ?,
            last_name = ?,
            staff_role = ?,
            license_number = ?,
            contact_number = ?,
            is_active = ?
        WHERE staff_id = ?
    `;

    db.query(
        sql,
        [
            data.zone_id,
            data.first_name,
            data.last_name,
            data.staff_role,
            data.license_number,
            data.contact_number,
            data.is_active === undefined ? true : data.is_active,
            id
        ],
        callback
    );
};

const getWithZones = (callback) => {
    const sql = `
        SELECT
            ms.staff_id,
            ms.first_name,
            ms.last_name,
            ms.staff_role,
            bz.zone_name
        FROM medical_staff ms
        INNER JOIN barangay_zones bz
            ON ms.zone_id = bz.zone_id
        ORDER BY ms.staff_id
    `;

    db.query(sql, callback);
};

const remove = (id, callback) => {
    db.query('DELETE FROM medical_staff WHERE staff_id = ?', [id], callback);
};

module.exports = {
    getAll,
    getById,
    getWithZones,
    create,
    update,
    delete: remove
};
