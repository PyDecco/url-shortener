FROM node:23.5.0

WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante da aplicação
COPY . .

# Gera client do Prisma
RUN npx prisma generate

RUN npm run build

# Porta padrão
EXPOSE 3000

CMD ["npm", "run", "start:dev"]

