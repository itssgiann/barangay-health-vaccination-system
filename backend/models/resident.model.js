const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM residents', callback);
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
    getById,
    create,
    update,
    delete: remove
};
