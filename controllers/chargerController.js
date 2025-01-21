const Charger = require('../models/chargerModel');

// Agregar un nuevo cargador
exports.addCharger = async (req, res) => {
  const { name, location, status, type } = req.body;

  try {
    const newCharger = await Charger.create({
      name,
      location,
      status,
      type
    });

    res.status(201).json({ message: 'Cargador agregado exitosamente', charger: newCharger });
  } catch (error) {
    console.error('Error al agregar el cargador:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los cargadores
exports.getChargers = async (req, res) => {
  try {
    const chargers = await Charger.findAll();
    res.status(200).json(chargers);
  } catch (error) {
    console.error('Error al obtener los cargadores:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un cargador por ID
exports.getChargerById = async (req, res) => {
  const { id } = req.params;

  try {
    const charger = await Charger.findByPk(id);

    if (!charger) {
      return res.status(404).json({ message: 'Cargador no encontrado' });
    }

    res.status(200).json(charger);
  } catch (error) {
    console.error('Error al obtener el cargador:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar un cargador
exports.updateCharger = async (req, res) => {
  const { id } = req.params;
  const { name, location, status, type } = req.body;

  try {
    const charger = await Charger.findByPk(id);

    if (!charger) {
      return res.status(404).json({ message: 'Cargador no encontrado' });
    }

    charger.name = name || charger.name;
    charger.location = location || charger.location;
    charger.status = status || charger.status;
    charger.type = type || charger.type;

    await charger.save();

    res.status(200).json({ message: 'Cargador actualizado exitosamente', charger });
  } catch (error) {
    console.error('Error al actualizar el cargador:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un cargador
exports.deleteCharger = async (req, res) => {
  const { id } = req.params;

  try {
    const charger = await Charger.findByPk(id);

    if (!charger) {
      return res.status(404).json({ message: 'Cargador no encontrado' });
    }

    await charger.destroy();

    res.status(200).json({ message: 'Cargador eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el cargador:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
