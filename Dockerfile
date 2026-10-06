# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# Stage 0: patched base image
# ─────────────────────────────────────────────
FROM node:24-alpine AS node-base

RUN apk upgrade --no-cache

# ─────────────────────────────────────────────
# Stage 1: install dependencies and build the library
# ─────────────────────────────────────────────
FROM node-base AS builder

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: lean image with the build output only
# ─────────────────────────────────────────────
FROM node-base AS runner

ENV NODE_ENV=production

# Nothing installs at runtime, and project overrides do not patch the
# dependencies bundled with global npm/corepack/yarn, so remove them.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn* \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/dist ./dist
