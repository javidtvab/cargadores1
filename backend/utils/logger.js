// Import required modules
const { createLogger, format, transports } = require('winston');

// Configure the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log', level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Export the logger
module.exports = logger;
