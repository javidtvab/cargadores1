// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos (nuestra interfaz web)
app.use(express.static('public'));

// Estructuras para almacenar el estado de los cargadores y transacciones (en memoria)
const chargePoints = new Map();
const transactions = new Map();

// Endpoint para obtener la lista de cargadores conectados (útil para la interfaz de administración)
app.get('/api/chargePoints', (req, res) => {
  const points = [];
  for (const [ws, data] of chargePoints.entries()) {
    points.push({
      chargerId: data.chargerId || 'No registrado',
      lastHeartbeat: data.lastHeartbeat || 'Nunca',
      transactions: data.transactions ? data.transactions.length : 0
    });
  }
  res.json(points);
});

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar el servidor WebSocket en la ruta '/ocpp'
const wss = new WebSocket.Server({ server, path: '/ocpp' });

wss.on('connection', (ws, req) => {
  console.log('Nuevo cargador conectado');
  // Inicializar datos para el cargador
  chargePoints.set(ws, { chargerId: null, lastHeartbeat: null, transactions: [] });

  ws.on('message', (data) => {
    console.log("Mensaje recibido:", data);

    let msg;
    try {
      msg = JSON.parse(data);
    } catch (err) {
      console.error("Error al parsear el mensaje JSON:", err);
      return;
    }

    // Verificar formato: se espera un arreglo JSON [messageTypeId, messageId, action, payload]
    if (!Array.isArray(msg) || msg.length < 3) {
      console.error("Formato de mensaje inválido");
      return;
    }

    const messageTypeId = msg[0];
    const messageId = msg[1];

    if (messageTypeId === 2) { // Mensaje de tipo "Call" (solicitud)
      const action = msg[2];
      const payload = msg[3] || {};

      // Enrutamiento según la acción recibida
      switch (action) {
        case 'BootNotification':
          handleBootNotification(ws, messageId, payload);
          break;
        case 'Heartbeat':
          handleHeartbeat(ws, messageId, payload);
          break;
        case 'StartTransaction':
          handleStartTransaction(ws, messageId, payload);
          break;
        case 'StopTransaction':
          handleStopTransaction(ws, messageId, payload);
          break;
        default:
          console.warn("Acción no implementada:", action);
          sendCallError(ws, messageId, "NotImplemented", "Acción no implementada", {});
          break;
      }
    } else {
      console.error("Tipo de mensaje no soportado:", messageTypeId);
    }
  });

  ws.on('close', () => {
    console.log('Cargador desconectado');
    chargePoints.delete(ws);
  });
});

// Funciones auxiliares para enviar respuestas

/**
 * Envía una respuesta de tipo CallResult.
 * Formato: [3, messageId, payload]
 */
function sendCallResult(ws, messageId, payload) {
  const response = [3, messageId, payload];
  ws.send(JSON.stringify(response));
}

/**
 * Envía una respuesta de tipo CallError.
 * Formato: [4, messageId, errorCode, errorDescription, errorDetails]
 */
function sendCallError(ws, messageId, errorCode, errorDescription, errorDetails) {
  const response = [4, messageId, errorCode, errorDescription, errorDetails];
  ws.send(JSON.stringify(response));
}

// Handlers para cada tipo de mensaje

function handleBootNotification(ws, messageId, payload) {
  // Extraer información del payload (por ejemplo, modelo del cargador)
  const chargerId = payload.chargePointModel || 'ModeloDesconocido';
  const details = chargePoints.get(ws);
  if (details) {
    details.chargerId = chargerId;
    details.lastHeartbeat = new Date().toISOString();
  }

  const responsePayload = {
    status: "Accepted", // En producción se pueden rechazar solicitudes según lógica de negocio
    currentTime: new Date().toISOString(),
    interval: 300 // Intervalo en segundos para el siguiente heartbeat
  };
  sendCallResult(ws, messageId, responsePayload);
  console.log(`BootNotification procesado para: ${chargerId}`);
}

function handleHeartbeat(ws, messageId, payload) {
  const details = chargePoints.get(ws);
  if (details) {
    details.lastHeartbeat = new Date().toISOString();
  }
  sendCallResult(ws, messageId, { currentTime: new Date().toISOString() });
  console.log("Heartbeat procesado");
}

function handleStartTransaction(ws, messageId, payload) {
  const transactionId = uuidv4();
  const details = chargePoints.get(ws);
  if (details) {
    if (!details.transactions) {
      details.transactions = [];
    }
    details.transactions.push(transactionId);
  }

  transactions.set(transactionId, {
    chargePoint: details ? details.chargerId : 'Desconocido',
    idTag: payload.idTag || null,
    meterStart: payload.meterStart || 0,
    timestampStart: payload.timestamp || new Date().toISOString(),
    status: "inProgress"
  });

  const responsePayload = {
    transactionId: transactionId,
    idTagInfo: {
      status: "Accepted"
    }
  };

  sendCallResult(ws, messageId, responsePayload);
  console.log(`StartTransaction procesado, ID: ${transactionId}`);
}

function handleStopTransaction(ws, messageId, payload) {
  const transactionId = payload.transactionId;
  if (!transactions.has(transactionId)) {
    sendCallError(ws, messageId, "NotFound", "Transacción no encontrada", {});
    return;
  }

  const transaction = transactions.get(transactionId);
  transaction.meterStop = payload.meterStop || 0;
  transaction.timestampStop = payload.timestamp || new Date().toISOString();
  transaction.status = "completed";

  const responsePayload = {
    idTagInfo: {
      status: "Accepted"
    }
  };

  sendCallResult(ws, messageId, responsePayload);
  console.log(`StopTransaction procesado para la transacción: ${transactionId}`);
}

// Iniciar el servidor HTTP
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
