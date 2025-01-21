const Billing = require('../models/billingModel');
const Charger = require('../models/chargerModel');

// Calcular el costo basado en el consumo de kW
const calculateCost = (kWhConsumed, rate) => {
  return kWhConsumed * rate;
};

// Crear una nueva factura
const createInvoice = async (userId, chargerId, kWhConsumed) => {
  try {
    // Obtener el cargador y su tarifa
    const charger = await Charger.findByPk(chargerId);
    if (!charger) {
      throw new Error('Cargador no encontrado');
    }

    // Calcular el costo
    const cost = calculateCost(kWhConsumed, charger.rate);

    // Crear una nueva factura
    const newInvoice = await Billing.create({
      userId,
      chargerId,
      kWhConsumed,
      cost
    });

    return newInvoice;
  } catch (error) {
    console.error('Error al crear la factura:', error);
    throw new Error('Error al crear la factura');
  }
};

// Obtener todas las facturas de un usuario
const getUserInvoices = async (userId) => {
  try {
    const invoices = await Billing.findAll({ where: { userId } });
    return invoices;
  } catch (error) {
    console.error('Error al obtener las facturas del usuario:', error);
    throw new Error('Error al obtener las facturas del usuario');
  }
};

// Obtener una factura por ID
const getInvoiceById = async (id) => {
  try {
    const invoice = await Billing.findByPk(id);
    if (!invoice) {
      throw new Error('Factura no encontrada');
    }
    return invoice;
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    throw new Error('Error al obtener la factura');
  }
};

module.exports = {
  createInvoice,
  getUserInvoices,
  getInvoiceById,
};
