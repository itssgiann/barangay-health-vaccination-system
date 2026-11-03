const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAll = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            console.log('USER ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getById = (req, res) => {
    User.getById(req.params.id, (err, results) => {
        if (err) {
            console.log('USER ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    User.findByUsername(username, (err, results) => {
        if (err) {
            console.log('USER ERROR:', err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const user = results[0];

        if (user.is_active === 0 || user.is_active === false) {
            return res.status(401).json({
                message: 'Account is deactivated'
            });
        }

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.log('BCRYPT ERROR:', err);
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Invalid username or password'
                });
            }

            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role,
                    staff_id: user.staff_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role,
                    staff_id: user.staff_id
                }
            });
        });
    });
};

const create = (req, res) => {
    const {
        staff_id,
        username,
        password_hash,
        role,
        is_active
    } = req.body;

    if (!staff_id || !username || !password_hash || !role) {
        return res.status(400).json({
            message: 'staff_id, username, password_hash and role are required'
        });
    }

    User.create(
        {
            staff_id,
            username,
            password_hash,
            role,
            is_active
        },
        (err, result) => {
            if (err) {
                console.log('USER ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Username or staff already has an account'
                    });
                }

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Invalid reference: a related record does not exist'
                    });
                }

                if (
                    err.code === 'ER_DATA_TOO_LONG' ||
                    err.code === 'ER_TRUNCATED_WRONG_VALUE'
                ) {
                    return res.status(400).json({
                        message: 'Invalid data: check the values you sent'
                    });
                }

                return res.status(500).json({
                    message: 'Database error',
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'User created',
                user_id: result.insertId
            });
        }
    );
};

const update = (req, res) => {
    const {
        staff_id,
        username,
        password_hash,
        role,
        is_active
    } = req.body;

    if (!staff_id || !username || !role) {
        return res.status(400).json({
            message: 'staff_id, username and role are required'
        });
    }

    User.update(
        req.params.id,
        {
            staff_id,
            username,
            password_hash,
            role,
            is_active
        },
        (err, result) => {
            if (err) {
                console.log('USER ERROR:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Username or staff already has an account'
                    });
                }

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Invalid reference: a related record does not exist'
                    });
                }

                if (
                    err.code === 'ER_DATA_TOO_LONG' ||
                    err.code === 'ER_TRUNCATED_WRONG_VALUE'
                ) {
                    return res.status(400).json({
                        message: 'Invalid data: check the values you sent'
                    });
                }

                return res.status(500).json({
                    message: 'Database error',
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                message: 'User updated'
            });
        }
    );
};

const remove = (req, res) => {
    User.delete(req.params.id, (err, result) => {
        if (err) {
            console.log('USER ERROR:', err);

            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User deleted'
        });
    });
};

module.exports = {
    getAll,
    getById,
    login,
    create,
    update,
    delete: remove
};