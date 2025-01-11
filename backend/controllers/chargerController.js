// Get all chargers
async function getAllChargers(req, res) {
  try {
    const result = await req.db.query('SELECT * FROM chargers');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve chargers' });
  }
}

// Get charger by ID
async function getChargerById(req, res) {
  try {
    const { id } = req.params;
    const result = await req.db.query('SELECT * FROM chargers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Charger not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve charger' });
  }
}

// Create a new charger
async function createCharger(req, res) {
  try {
    const { name, location, capacity } = req.body;
    const result = await req.db.query(
      'INSERT INTO chargers (name, location, capacity) VALUES ($1, $2, $3) RETURNING *',
      [name, location, capacity]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create charger' });
  }
}

// Update a charger
async function updateCharger(req, res) {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;
    const result = await req.db.query(
      'UPDATE chargers SET name = $1, location = $2, capacity = $3 WHERE id = $4 RETURNING *',
      [name, location, capacity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Charger not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update charger' });
  }
}

// Delete a charger
async function deleteCharger(req, res) {
  try {
    const { id } = req.params;
    const result = await req.db.query('DELETE FROM chargers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Charger not found' });
    }
    res.status(200).json({ success: true, message: 'Charger deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete charger' });
  }
}

// Create a new tariff
async function createTariff(req, res) {
  try {
    const { name, rate, timeSlotStart, timeSlotEnd } = req.body;
    const result = await req.db.query(
      'INSERT INTO tariffs (name, rate, time_slot_start, time_slot_end) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, rate, timeSlotStart, timeSlotEnd]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create tariff' });
  }
}

// Update an existing tariff
async function updateTariff(req, res) {
  try {
    const { id } = req.params;
    const { name, rate, timeSlotStart, timeSlotEnd } = req.body;
    const result = await req.db.query(
      'UPDATE tariffs SET name = $1, rate = $2, time_slot_start = $3, time_slot_end = $4 WHERE id = $5 RETURNING *',
      [name, rate, timeSlotStart, timeSlotEnd, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tariff not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update tariff' });
  }
}

// Delete a tariff
async function deleteTariff(req, res) {
  try {
    const { id } = req.params;
    const result = await req.db.query('DELETE FROM tariffs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tariff not found' });
    }
    res.status(200).json({ success: true, message: 'Tariff deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete tariff' });
  }
}

module.exports = {
  getAllChargers,
  getChargerById,
  createCharger,
  updateCharger,
  deleteCharger,
  createTariff,
  updateTariff,
  deleteTariff,
};

