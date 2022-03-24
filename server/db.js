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

const getRecentUsers = (limit = 4) => {
  return db.query('SELECT * FROM users ORDER BY id DESC LIMIT $1', [limit]).then(({ rows }) => rows);
};

const getFriendship = ({ first_id, second_id }) => {
  return db
    .query(
      `SELECT * FROM friendships
  WHERE sender_id = $1 AND recipient_id = $2
     OR sender_id = $2 AND recipient_id = $1`,
      [first_id, second_id]
    )
    .then(({ rows }) => rows[0]);
};

const makeNewFriendship = ({ sender_id, recipient_id }) => {
  return db.query(`INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2)`, [sender_id, recipient_id]);
};

const acceptFriendship = ({ sender_id, recipient_id }) => {
  return db.query(`UPDATE friendships SET accepted = true WHERE sender_id = $1 AND recipient_id = $2`, [
    sender_id,
    recipient_id,
  ]);
};

const deleteFriendship = ({ first_id, second_id }) => {
  return db.query(
    `DELETE FROM friendships WHERE sender_id = $1 AND recipient_id = $2 OR sender_id = $2 AND recipient_id = $1`,
    [first_id, second_id]
  );
};

const searchUsers = (query) => {
  return db
    .query('SELECT * FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1', [query + '%'])
    .then(({ rows }) => rows);
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

const getFriendships = (user_id) => {
  return db
    .query(
      `SELECT friendships.accepted, friendships.id AS friendship_id,
  users.id AS user_id,
  users.first_name, users.last_name, users.profile_picture_url
  FROM friendships
  JOIN users
  ON (
      users.id = friendships.sender_id
      AND friendships.recipient_id = $1)
  OR (
      users.id = friendships.recipient_id
      AND friendships.sender_id = $1
      AND accepted = true)`,
      [user_id]
    )
    .then(({ rows }) => rows);
};

const getChatMessages = ({ limit }) => {
  return db
    .query(
      `SELECT chat_messages.*, users.first_name, users.last_name
          FROM chat_messages
          JOIN users
          ON users.id = chat_messages.sender_id
          ORDER BY id DESC
          LIMIT $1
`,
      [limit]
    )
    .then((result) => result.rows);
};

const createChatMessage = ({ sender_id, text }) => {
  return db
    .query(`INSERT INTO chat_messages (sender_id, text) VALUES ($1, $2)`, [sender_id, text])
    .then((result) => result.rows[0]);
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
  getRecentUsers,
  searchUsers,
  getFriendship,
  makeNewFriendship,
  acceptFriendship,
  deleteFriendship,
  getFriendships,
  createChatMessage,
  getChatMessages,
};
