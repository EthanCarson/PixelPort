# Stage 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Deno
FROM denoland/deno:latest

WORKDIR /app

# Copy the server and the built assets from the builder stage
COPY --from=builder /app/dist ./dist
COPY server.ts .

ENV PORT=3000
EXPOSE 3000

# Deno requires explicit permissions
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "server.ts"]
