FROM node:22-alpine AS base

# Set working directory
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy the full app
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app (runs as root)
RUN npm run build

# Fix permissions so cache files can be written at runtime
RUN mkdir -p /app/.next/cache && chmod -R 777 /app/.next

# Expose Next.js port
EXPOSE 3000


