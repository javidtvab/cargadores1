// Import required modules
const { Pool } = require('pg');

// Charger model queries
const createCharger = async (pool, name, location, capacity) => {
  const result = await pool.query(
    'INSERT INTO chargers (name, location, capacity) VALUES ($1, $2, $3) RETURNING *',
    [name, location, capacity]
  );
  return result.rows[0];
};

const getChargerById = async (pool, id) => {
  const result = await pool.query(
    'SELECT * FROM chargers WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllChargers = async (pool) => {
  const result = await pool.query('SELECT * FROM chargers');
  return result.rows;
};

const updateCharger = async (pool, id, name, location, capacity) => {
  const result = await pool.query(
    'UPDATE chargers SET name = $1, location = $2, capacity = $3 WHERE id = $4 RETURNING *',
    [name, location, capacity, id]
  );
  return result.rows[0];
};

const deleteCharger = async (pool, id) => {
  const result = await pool.query(
    'DELETE FROM chargers WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createCharger,
  getChargerById,
  getAllChargers,
  updateCharger,
  deleteCharger,
};
