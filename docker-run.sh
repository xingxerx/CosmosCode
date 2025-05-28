#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t cosmoscode .

# Run the container
echo "Running CosmosCode container..."
docker run -p 3000:3000 cosmoscode