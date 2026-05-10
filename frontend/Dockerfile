# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Nginx is handled by docker-compose, but we can provide a dummy CMD or exit
# This Dockerfile just builds the assets which are shared via volume
CMD ["echo", "Build completed"]
