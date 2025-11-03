# ==========================
# 1️⃣ Base image (Node 20 LTS)
# ==========================
FROM node:20-alpine AS base
WORKDIR /app

# ==========================
# 2️⃣ Dependencies layer
# ==========================
FROM base AS deps
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies (includes devDeps for build)
RUN npm ci --legacy-peer-deps

# ==========================
# 3️⃣ Build stage
# ==========================
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY package*.json ./
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./

# Run build with verbose logging for debugging
RUN npm run build --verbose || (echo "❌ Build failed! Check the logs above." && exit 1)

# ==========================
# 4️⃣ Production stage
# ==========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Fix permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

# Final startup command
CMD ["node", "dist/index.js"]
