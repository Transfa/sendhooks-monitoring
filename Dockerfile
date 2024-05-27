# Stage 1: Build stage for backend
FROM node:16-alpine as backend-build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Build the NestJS application
RUN npm run build

# Stage 2: Build stage for dashboard
FROM node:20-alpine as dashboard-build

# Set the working directory for the dashboard
WORKDIR /app/dashboard

# Copy dashboard package.json and package-lock.json
COPY dashboard/package*.json ./

# Install dashboard dependencies
RUN npm install

# Copy dashboard source code
COPY dashboard/ .

# Build the Next.js application
RUN npm run build

# Stage 3: Final stage
FROM node:20-alpine

# Install Supervisor
RUN apk update && \
    apk add supervisor && \
    mkdir -p /data/db /data/redis /var/log/supervisor

# Set the working directories for backend and dashboard
WORKDIR /app

# Copy the backend and dashboard build outputs from previous stages
COPY --from=backend-build /app/backend /app/backend
COPY --from=dashboard-build /app/dashboard /app/dashboard

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/

# Make entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose ports for the dashboard and backend
EXPOSE 3000
EXPOSE 5002

# Set the entrypoint
ENTRYPOINT ["entrypoint.sh"]
