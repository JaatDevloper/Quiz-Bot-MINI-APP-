# -------------------------------------------------
# 1️⃣ CLIENT BUILD (React + Vite)
# -------------------------------------------------
FROM node:20-alpine AS client-builder

WORKDIR /app

# Copy only client files and common configs
COPY package*.json ./
COPY client ./client
COPY tsconfig.* vite.config.* ./

# Install and build the client
RUN npm install
RUN npm run build

# -------------------------------------------------
# 2️⃣ SERVER BUILD (Express + TypeScript)
# -------------------------------------------------
FROM node:20-alpine AS server-builder

WORKDIR /app

# Copy everything for server build
COPY . .
RUN npm install
RUN npm run build

# -------------------------------------------------
# 3️⃣ FINAL PRODUCTION IMAGE
# -------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy built client + server from previous stages
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies (no dev)
RUN npm install --omit=dev

# Serve everything on port 5000 (client + API)
EXPOSE 5000

# Start production server
CMD ["npm", "start"]
