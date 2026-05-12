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

# Final stage - serve built files via a lightweight image
FROM busybox:1.36
COPY --from=build /app/dist /dist

# Copy dist to the shared volume mount point on startup
CMD ["sh", "-c", "cp -r /dist/* /output/ 2>/dev/null; echo 'Frontend build copied'; sleep infinity"]
