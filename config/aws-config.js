require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
const AWS = require('aws-sdk');

// Configuración de las credenciales de AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION // Región donde se encuentran tus recursos de AWS
});

// Ejemplo de configuración para S3
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: process.env.S3_BUCKET_NAME }
});

// Ejemplo de configuración para RDS (MySQL)
const rds = new AWS.RDS({
  apiVersion: '2014-10-31'
});

module.exports = { AWS, s3, rds };
