const Billing = require('../models/billingModel');
const Charger = require('../models/chargerModel');

// Crear una nueva factura
exports.createInvoice = async (req, res) => {
  const { userId, chargerId, kWhConsumed } = req.body;

  try {
    // Obtener el cargador y su tarifa
    const charger = await Charger.findByPk(chargerId);
    if (!charger) {
      return res.status(404).json({ message: 'Cargador no encontrado' });
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

    res.status(201).json({ message: 'Factura creada exitosamente', invoice: newInvoice });
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todas las facturas de un usuario
exports.getUserInvoices = async (req, res) => {
  const { userId } = req.params;

  try {
    const invoices = await Billing.findAll({ where: { userId } });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error al obtener las facturas del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener una factura por ID
exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Billing.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Calcular el costo basado en el consumo de kW
const calculateCost = (kWhConsumed, rate) => {
  return kWhConsumed * rate;
};
