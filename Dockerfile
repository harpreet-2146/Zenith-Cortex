# Stage 1: Build frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM node:20
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy frontend build output into backend folder
COPY --from=frontend-build /app/dist ./dist

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]
