
# Tutorial de Despliegue en AWS

Este documento contiene los pasos detallados para desplegar este proyecto en AWS.

## **1. Configurar AWS**
- **Crear instancia EC2**: Usa una máquina `Ubuntu 22.04` con al menos 20 GB de almacenamiento.
- **Configurar seguridad**: Asegúrate de abrir los puertos `22`, `80` y `443`.

## **2. Configurar el Backend**
1. Instala dependencias: Python, PostgreSQL.
2. Configura la base de datos:
   - Crea la base de datos `charging_station`.
   - Configura las credenciales en `.env`.

## **3. Configurar el Frontend**
1. Instala Node.js.
2. Configura el componente Razorpay con tu API Key.

## **4. Configurar Nginx**
1. Configura un proxy inverso para enrutar `/api` al backend.
2. Sirve el frontend desde la carpeta `build`.

## **5. Habilitar HTTPS**
1. Usa Certbot para generar certificados SSL.

## **6. Probar la Implementación**
Accede a la URL pública de tu instancia para confirmar que todo funciona correctamente.
