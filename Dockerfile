# ==========================
# 1️⃣ Base image (Node 20 LTS)
# ==========================
FROM node:20-alpine AS base
WORKDIR /app

# ==========================
# 2️⃣ Dependencies layer
# ==========================
FROM base AS deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ==========================
# 3️⃣ Build stage (Vite + TS)
# ==========================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Build the frontend (verbose to see logs)
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
RUN npm ci --omit=dev && npm cache clean --force

# ✅ Copy build output (adjust path if needed)
# If your build output is in client/dist, use that
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Fix permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

# ✅ Start the server (adjust if your entry is different)
CMD ["node", "server/index.js"]
