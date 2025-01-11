// Database configuration for PostgreSQL
module.exports = {
  user: process.env.DB_USER || 'javidtvab',
  host: process.env.DB_HOST || 'cargadores.cxmq8oemyrmq.eu-north-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'cargadores',
  password: process.env.DB_PASSWORD || '2512javierCc?',
  port: process.env.DB_PORT || 5432,
};
