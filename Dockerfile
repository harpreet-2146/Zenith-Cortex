# Frontend build
FROM node:20 AS build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# Backend
FROM node:20
WORKDIR /app
# Copy backend package files first and install dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
# Copy the rest of the backend code
COPY backend ./backend
# Copy frontend build from previous stage
COPY --from=build /app/frontend/dist ../frontend/dist

# Expose the port for Cloud Run
EXPOSE 8080
ENV PORT=8080

# Start the server
CMD ["node", "server.js"]
