const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = require('../secrets.json');

console.log(`[db] Connecting to: ${DATABASE_NAME}`);
const db = spicedPg(`postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`);

const getHash = (password) => {
  return bcrypt.genSalt().then((salt) => {
    return bcrypt.hash(password, salt);
  });
};

const createUser = ({ first_name, last_name, email_address, password }) => {
  return getHash(password).then((password_hash) => {
    return db
      .query('INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *', [
        first_name,
        last_name,
        email_address,
        password_hash,
      ])
      .then(({ rows }) => rows[0]);
  });
};

const getUserById = (id) => {
  return db.query('SELECT * FROM users WHERE id = $1', [id]).then(({ rows }) => rows[0]);
};

const getUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = $1', [email]).then(({ rows }) => rows[0]);
};

const login = ({ email_address, password }) => {
  return getUserByEmail(email_address).then((foundUser) => {
    if (!foundUser) {
      return null;
    }
    return bcrypt.compare(password, foundUser.password_hash).then((match) => {
      if (match) {
        return foundUser;
      }
      return null;
    });
  });
};

const addPasswordResetCode = ({ email_address, code }) => {
  return db
    .query('INSERT INTO password_reset_codes (email, code) VALUES ($1, $2)', [email_address, code])
    .then(({ rows }) => rows[0]);
};

const findPasswordResetCode = (code) => {
  return db
    .query(
      "SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND code = $1",
      [code]
    )
    .then(({ rows }) => rows[0]);
};

const updatePassword = ({ password, email_address }) => {
  return getHash(password).then((password_hash) => {
    return db.query('UPDATE users SET password_hash = $1 WHERE email = $2', [password_hash, email_address]);
  });
};

const updateProfilePicture = ({ url, user_id }) => {
  return db
    .query('UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING *', [url, user_id])
    .then(({ rows }) => rows[0]);
};

const updateUserBio = ({ bio, user_id }) => {
  return db.query('UPDATE users SET bio = $1 WHERE id = $2 RETURNING *', [bio, user_id]).then(({ rows }) => rows[0]);
};

module.exports = {
  createUser,
  getUserById,
  login,
  getUserByEmail,
  addPasswordResetCode,
  findPasswordResetCode,
  updatePassword,
  updateProfilePicture,
  updateUserBio,
};
