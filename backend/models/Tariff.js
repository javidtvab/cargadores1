// Import required modules
const { Pool } = require('pg');

// Tariff model queries
const createTariff = async (pool, name, rate, timeSlotStart, timeSlotEnd) => {
  const result = await pool.query(
    'INSERT INTO tariffs (name, rate, time_slot_start, time_slot_end) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, rate, timeSlotStart, timeSlotEnd]
  );
  return result.rows[0];
};

const getTariffById = async (pool, id) => {
  const result = await pool.query(
    'SELECT * FROM tariffs WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllTariffs = async (pool) => {
  const result = await pool.query('SELECT * FROM tariffs');
  return result.rows;
};

const updateTariff = async (pool, id, name, rate, timeSlotStart, timeSlotEnd) => {
  const result = await pool.query(
    'UPDATE tariffs SET name = $1, rate = $2, time_slot_start = $3, time_slot_end = $4 WHERE id = $5 RETURNING *',
    [name, rate, timeSlotStart, timeSlotEnd, id]
  );
  return result.rows[0];
};

const deleteTariff = async (pool, id) => {
  const result = await pool.query(
    'DELETE FROM tariffs WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTariff,
  getTariffById,
  getAllTariffs,
  updateTariff,
  deleteTariff,
};
