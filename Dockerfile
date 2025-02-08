# Dockerfile
FROM node:16-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de dependencias y lo instala
COPY package.json .
RUN npm install --production

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación (puede ajustarse si se utiliza otra variable)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
