# Stage 1: Build
FROM node:20-alpine AS builder

# Create app directory with appropriate ownership
WORKDIR /app
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install

# Copy rest of the code and set ownership
COPY --chown=node:node . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build:ts
# ----------------------------------------

# Stage 2: Runtime
FROM node:20-alpine AS runner

# Create app directory and set correct permissions
WORKDIR /app

# Create a non-root user (node user already exists in alpine)
USER node

# Copy only necessary files from build stage, preserving ownership
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/.env ./.env

# Generate Prisma client again in runtime (optional)
RUN npx prisma generate

# Expose Fastify app port
EXPOSE 3000

# Start the Fastify server
CMD ["node", "dist/server.js"]
