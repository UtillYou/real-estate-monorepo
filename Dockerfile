# Stage 1: Build the backend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN npm install -w backend --workspaces=false

# Copy source code
COPY . .

# Build the backend
RUN npm run build --workspace=backend

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

# Install production dependencies
RUN npm install --production -w backend --workspaces=false

# Copy built files
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
