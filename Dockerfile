# Usa una imagen base de Node.js
FROM node:14

# Instala http-server
RUN npm install -g http-server

# Copia los archivos de la aplicación al contenedor
COPY . /usr/src/app

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Exponer el puerto 80, que es el puerto especificado en docker-compose.yml
EXPOSE 80

# Comando para ejecutar http-server en el puerto 80
CMD [ "http-server", "-p", "80" ]