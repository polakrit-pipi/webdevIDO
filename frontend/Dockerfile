# ============================================
# Next.js Frontend - Multi-stage Dockerfile
# ============================================

# --- Stage 1: Install dependencies ---
FROM node:20-alpine AS deps

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm ci

# --- Stage 2: Build the application ---
FROM node:20-alpine AS build

WORKDIR /opt/app

COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .

# Build-time env: Strapi URL accessible from the browser (client-side)
ARG NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL

RUN npm run build

# --- Stage 3: Production image ---
FROM node:20-alpine AS production

WORKDIR /opt/app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only what's needed to run
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/.next/standalone ./
COPY --from=build /opt/app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
