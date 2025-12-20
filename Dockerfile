# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (including dev dependencies for Prisma)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy Prisma CLI and generated client from builder (needed for migrations)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY prisma ./prisma

# Copy application code
COPY src ./src

# Generate Prisma Client in production image
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start the application (migrations should be run separately on Render or via a startup script)
CMD ["npm", "start"]

