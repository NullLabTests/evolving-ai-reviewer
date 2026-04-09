# Multi-stage Dockerfile for Evolving AI Reviewer
# Frontend (React/Vite) + Backend (Node.js) + Database

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY tsconfig*.json ./
COPY postcss.config.js ./

# Install frontend dependencies
RUN npm ci --only=production

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/src/ ./src/
COPY backend/prisma/ ./prisma/

# Install backend dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Build backend
RUN npm run build

# Stage 3: Production Runtime
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy built applications
COPY --from=frontend-builder /app/frontend/dist ./public
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]

# Stage 4: Development Environment
FROM node:18-alpine AS development

WORKDIR /app

# Install system dependencies for development
RUN apk add --no-cache \
    curl \
    git \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install all dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose ports
EXPOSE 3001 5173

# Start development servers
CMD ["npm", "run", "dev:all"]

# Stage 5: Backend-only for API
FROM node:18-alpine AS backend-only

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/src/ ./src/
COPY backend/prisma/ ./prisma/

# Install dependencies
RUN npm ci --only=production
RUN npx prisma generate

# Build
RUN npm run build

# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
