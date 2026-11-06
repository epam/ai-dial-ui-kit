FROM node:24-alpine AS base

RUN apk upgrade --no-cache

# Set working directory
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy the full app
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app (runs as root)
RUN npm run build

# Fix permissions so cache files can be written at runtime
RUN mkdir -p /app/.next/cache && chmod -R 777 /app/.next

# Expose Next.js port
EXPOSE 3000

# Nothing installs at runtime, and project overrides do not patch the
# dependencies bundled with global npm/corepack/yarn, so remove them.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn* \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg
