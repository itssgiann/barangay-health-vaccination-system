const db = require('../config/db');

const getAll = (callback) => {
    db.query('SELECT * FROM immunization_milestones', callback);
};

module.exports = ImmunizationMilestone; 
