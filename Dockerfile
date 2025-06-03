<<<<<<< HEAD
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
=======
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

# Set environment variables
ENV NODE_ENV=production
# For testing in CI/CD, override with NODE_ENV=test

EXPOSE 3000
CMD ["node", "index.js"]
>>>>>>> bdb8e8e0e14d131f9b95cde11e20a304d895b17c
