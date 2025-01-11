// OCPP server configuration
module.exports = {
  port: process.env.OCPP_SERVER_PORT || 9220,
  heartbeatInterval: process.env.OCPP_HEARTBEAT_INTERVAL || 60000, // in milliseconds
  logLevel: process.env.OCPP_LOG_LEVEL || 'info',
};
