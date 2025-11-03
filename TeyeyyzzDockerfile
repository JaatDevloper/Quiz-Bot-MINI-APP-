# ==========================
# 1️⃣ Base image
# ==========================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ==========================
# 2️⃣ Install dependencies
# ==========================
FROM base AS deps
RUN npm ci --legacy-peer-deps

# ==========================
# 3️⃣ Build frontend + backend
# ==========================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Build frontend
RUN npm run build --verbose || (echo "❌ Frontend build failed!" && exit 1)

# ✅ Build backend (TS → JS)
RUN npx tsc --project tsconfig.server.json || (echo "❌ Backend build failed!" && exit 1)

# ==========================
# 4️⃣ Run server
# ==========================
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
