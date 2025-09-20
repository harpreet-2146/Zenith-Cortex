# Frontend build
FROM node:20 AS build
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Backend
FROM node:20
WORKDIR /app
COPY backend ./backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY --from=build /app/frontend/dist ../frontend/dist
ENV PORT=8080
CMD ["node", "server.js"]
