# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Python dependencies
FROM python:3.10-slim AS python-deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
COPY --from=python-deps /usr/local/lib/python3.10 /usr/local/lib/python3.10

# Install Python runtime
RUN apk add --no-cache python3

EXPOSE 3000
CMD ["node", "index.js"]
