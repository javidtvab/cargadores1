const Charger = require('../models/chargerModel');

// Agregar un nuevo cargador
const addCharger = async (chargerData) => {
  try {
    const newCharger = await Charger.create(chargerData);
    return newCharger;
  } catch (error) {
    console.error('Error al agregar el cargador:', error);
    throw new Error('Error al agregar el cargador');
  }
};

// Obtener todos los cargadores
const getChargers = async () => {
  try {
    const chargers = await Charger.findAll();
    return chargers;
  } catch (error) {
    console.error('Error al obtener los cargadores:', error);
    throw new Error('Error al obtener los cargadores');
  }
};

// Obtener un cargador por ID
const getChargerById = async (id) => {
  try {
    const charger = await Charger.findByPk(id);
    if (!charger) {
      throw new Error('Cargador no encontrado');
    }
    return charger;
  } catch (error) {
    console.error('Error al obtener el cargador:', error);
    throw new Error('Error al obtener el cargador');
  }
};

// Actualizar un cargador
const updateCharger = async (id, chargerData) => {
  try {
    const charger = await Charger.findByPk(id);
    if (!charger) {
      throw new Error('Cargador no encontrado');
    }

    await charger.update(chargerData);
    return charger;
  } catch (error) {
    console.error('Error al actualizar el cargador:', error);
    throw new Error('Error al actualizar el cargador');
  }
};

// Eliminar un cargador
const deleteCharger = async (id) => {
  try {
    const charger = await Charger.findByPk(id);
    if (!charger) {
      throw new Error('Cargador no encontrado');
    }

    await charger.destroy();
    return { message: 'Cargador eliminado exitosamente' };
  } catch (error) {
    console.error('Error al eliminar el cargador:', error);
    throw new Error('Error al eliminar el cargador');
  }
};

module.exports = {
  addCharger,
  getChargers,
  getChargerById,
  updateCharger,
  deleteCharger,
};
