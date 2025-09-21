# 1️⃣ Build frontend
FROM node:20 AS build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# 2️⃣ Setup backend
FROM node:20
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend ./ 

# Copy frontend build into backend
COPY --from=build /app/frontend/dist ./dist

# Expose Cloud Run port
EXPOSE 8080
ENV PORT=8080

# Start server
CMD ["node", "server.js"]
