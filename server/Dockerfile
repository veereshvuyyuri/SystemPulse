# Backend Dockerfile
FROM node:18-slim

WORKDIR /app

# Install dependencies for systeminformation
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./
RUN npm install --production

COPY server/ .

# Ensure the database and certs directories exist
RUN mkdir -p db certs

EXPOSE 3001

CMD ["node", "index.js"]
