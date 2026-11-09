// Barangay Health - User accounts and login (Step 2 integration).
// NOTE: API role enforcement is a separate Step 3. Until then, do not expose this server publicly.
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MESSAGE_INVALID = 'Invalid username or password';
const sendDatabaseError = (res, err) => {
  console.error('User database error:', err);
  const codes = {
    ER_DUP_ENTRY: [409, 'Username or staff already has an account.'],
    ER_NO_REFERENCED_ROW_2: [400, 'Choose an existing staff member.'],
    ER_DATA_TOO_LONG: [400, 'One or more fields are too long.'],
    ER_TRUNCATED_WRONG_VALUE: [400, 'Check the values you entered.']
  };
  const [status, message] = codes[err?.code] || [500, 'Database error. Please contact the integrator.'];
  return res.status(status).json({ message });
};
const bodyOf = req => req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
const validPassword = value => typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72;
const isValidUsername = name => typeof name === 'string' && name.trim().length >= 3 && name.trim().length <= 50;
const isValidRole = role => typeof role === 'string' && role.trim().length > 0 && role.trim().length <= 20;
const isValidStaffId = id => Number.isSafeInteger(Number(id)) && Number(id) > 0;
const validActive = value => value === undefined || value === null || value === true || value === false || value === 0 || value === 1;

const getAll = (_req, res) => {
  User.getAll((err, rows) => err ? sendDatabaseError(res, err) : res.json(rows));
};
const getById = (req, res) => {
  User.getById(req.params.id, (err, rows) => {
    if (err) return sendDatabaseError(res, err);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    return res.json(rows[0]);
  });
};

const login = (req, res) => {
  const { username, password } = bodyOf(req);
  if (!isValidUsername(username) || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Enter your username and password.' });
  }
  // Never ship a hardcoded JWT secret or accept an empty development secret.
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('Missing/weak JWT_SECRET. Set a random 32+ character secret in backend/.env.');
    return res.status(503).json({ message: 'Login is not configured. Ask your team integrator to set JWT_SECRET.' });
  }
  User.findByUsername(username.trim(), (err, rows) => {
    if (err) return sendDatabaseError(res, err);
    if (!rows.length) return res.status(401).json({ message: MESSAGE_INVALID });
    const user = rows[0];
    if (user.is_active === 0 || user.is_active === false) {
      return res.status(401).json({ message: MESSAGE_INVALID });
    }
    bcrypt.compare(password, user.password_hash, (compareError, match) => {
      if (compareError) {
        console.error('Password verification error:', compareError);
        return res.status(500).json({ message: 'Unable to verify login. Please try again.' });
      }
      if (!match) return res.status(401).json({ message: MESSAGE_INVALID });
      let token;
      try {
        token = jwt.sign(
          { user_id: user.user_id, username: user.username, role: user.role, staff_id: user.staff_id },
          process.env.JWT_SECRET,
          { expiresIn: '8h' }
        );
      } catch (error) {
        console.error('Token signing error:', error);
        return res.status(500).json({ message: 'Unable to start the login session.' });
      }
      return res.json({
        message: 'Login successful', token,
        user: { user_id: user.user_id, username: user.username, role: user.role, staff_id: user.staff_id }
      });
    });
  });
};

const create = (req, res) => {
  const { staff_id, username, password, role, is_active } = bodyOf(req);
  if (!isValidStaffId(staff_id) || !isValidUsername(username) || !isValidRole(role)) {
    return res.status(400).json({ message: 'Choose staff, enter a 3-50 character username, and enter a valid role.' });
  }
  if (!validPassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and at most 72 UTF-8 bytes.' });
  }
  if (!validActive(is_active)) return res.status(400).json({ message: 'Invalid active status.' });
  bcrypt.hash(password, 10, (hashError, password_hash) => {
    if (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ message: 'Unable to create the account.' });
    }
    User.create({
      staff_id: Number(staff_id), username: username.trim(), password_hash,
      role: role.trim(), is_active: is_active == null ? true : Boolean(is_active)
    }, (err, result) => {
      if (err) return sendDatabaseError(res, err);
      return res.status(201).json({ message: 'User created', user_id: result.insertId });
    });
  });
};

const update = (req, res) => {
  const { staff_id, username, password, role, is_active } = bodyOf(req);
  if (!isValidStaffId(staff_id) || !isValidUsername(username) || !isValidRole(role)) {
    return res.status(400).json({ message: 'Choose staff, enter a 3-50 character username, and enter a valid role.' });
  }
  if (password != null && password !== '' && !validPassword(password)) {
    return res.status(400).json({ message: 'New password must be at least 8 characters and at most 72 UTF-8 bytes.' });
  }
  if (!validActive(is_active)) return res.status(400).json({ message: 'Invalid active status.' });
  const save = password_hash => {
    const record = {
      staff_id: Number(staff_id), username: username.trim(), role: role.trim(),
      // The existing model conditionally updates password_hash when it is provided.
      password_hash, is_active: is_active == null ? true : Boolean(is_active)
    };
    User.update(req.params.id, record, (err, result) => {
      if (err) return sendDatabaseError(res, err);
      if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User updated' });
    });
  };
  if (password == null || password === '') return save(undefined);
  bcrypt.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ message: 'Unable to update the account.' });
    }
    return save(hash);
  });
};

const remove = (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) return sendDatabaseError(res, err);
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted' });
  });
};
module.exports = { getAll, getById, login, create, update, delete: remove };
