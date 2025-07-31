FROM node:20

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala dependencias y genera cliente de Prisma
RUN npm install && npx prisma generate


# Expón el puerto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "run", "start"]