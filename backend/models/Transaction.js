// Import required modules
const { Pool } = require('pg');

// Transaction model queries
const createTransaction = async (pool, userId, chargerId, amount, status) => {
  const result = await pool.query(
    'INSERT INTO transactions (user_id, charger_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, chargerId, amount, status]
  );
  return result.rows[0];
};

const getTransactionById = async (pool, id) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllTransactions = async (pool) => {
  const result = await pool.query('SELECT * FROM transactions');
  return result.rows;
};

const updateTransactionStatus = async (pool, id, status) => {
  const result = await pool.query(
    'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

const deleteTransaction = async (pool, id) => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransactionStatus,
  deleteTransaction,
};
