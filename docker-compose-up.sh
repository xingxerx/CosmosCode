#!/bin/bash

# Start all services with docker-compose
echo "Starting CosmosCode environment with docker-compose..."
docker-compose up -d

echo "Services started. Access the application at http://localhost:3000"