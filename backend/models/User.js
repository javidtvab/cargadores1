// Import required modules
const { Pool } = require('pg');

// User model queries
const createUser = async (pool, username, hashedPassword, email) => {
  const result = await pool.query(
    'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
    [username, hashedPassword, email]
  );
  return result.rows[0];
};

const getUserById = async (pool, id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllUsers = async (pool) => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

const updateUser = async (pool, id, username, email) => {
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
    [username, email, id]
  );
  return result.rows[0];
};

const deleteUser = async (pool, id) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
