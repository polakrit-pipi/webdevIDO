# ============================================
# Express.js Backend - Multi-stage Dockerfile
# ============================================

# --- Stage 1: Install ALL dependencies (for build) ---
FROM node:20-alpine AS deps
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2: Build TypeScript ---
FROM node:20-alpine AS build
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npx tsc

# --- Stage 3: Install PROD dependencies only ---
FROM node:20-alpine AS prod-deps
WORKDIR /opt/app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate

# --- Stage 4: Production image ---
FROM node:20-alpine AS production
WORKDIR /opt/app
ENV NODE_ENV=production

# Copy compiled JS
COPY --from=build /opt/app/dist ./dist
# Copy production-only node_modules
COPY --from=prod-deps /opt/app/node_modules ./node_modules
# Copy generated Prisma client
COPY --from=prod-deps /opt/app/prisma ./prisma
COPY package.json ./

# Create uploads directory
RUN mkdir -p ./public/uploads

EXPOSE 1337

# Run prisma migrate on start, then launch
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
