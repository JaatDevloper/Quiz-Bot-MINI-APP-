# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the frontend (creates /app/dist/index.js and /app/dist/public)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built files
COPY --from=builder /app/node_modules ./node_modules

# 🟢 CRITICAL FIX: Copy the ENTIRE 'dist' folder.
# This contains BOTH the compiled backend server (index.js) AND the frontend static assets (public/).
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/package*.json ./
# Removed unnecessary copies of source code folders (server and shared)

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "start"]
