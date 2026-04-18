# ============================================
# Next.js Admin Dashboard - Multi-stage Dockerfile
# ============================================

# --- Stage 1: Install dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2: Build the application ---
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env: API URL accessible from the browser (client-side)
ARG NEXT_PUBLIC_API_URL=http://localhost:1337
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- Stage 3: Production image ---
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Copy only what's needed to run (standalone output)
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
