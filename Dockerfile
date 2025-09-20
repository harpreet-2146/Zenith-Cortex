# Step 1: Build frontend
FROM node:18 AS build
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Step 2: Setup backend
FROM node:18
WORKDIR /app

# Copy backend files
COPY backend ./backend
COPY backend/package*.json ./backend/

# Install backend deps
WORKDIR /app/backend
RUN npm install

# Copy built frontend into backend
COPY --from=build /app/frontend/dist ../frontend/dist

# Expose port (Cloud Run will override with $PORT)
ENV PORT=8080
CMD ["node", "server.js"]
