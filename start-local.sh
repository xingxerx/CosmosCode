#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the main file exists
if [ ! -f "src/index.js" ]; then
    echo "Main file src/index.js not found. Creating a minimal version..."
    
    # Create directories if they don't exist
    mkdir -p src/api/controllers
    mkdir -p src/services/cosmology
    mkdir -p src/services/visualization
    mkdir -p src/utils
    
    # Create a minimal logger
    cat > src/utils/logger.js << 'EOL'
module.exports = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`)
};
EOL

    # Create a minimal index.js
    cat > src/index.js << 'EOL'
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.send('CosmosCode API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mock simulation endpoint
app.post('/api/simulations', (req, res) => {
  console.log('Received simulation request:', req.body);
  
  // Mock response
  setTimeout(() => {
    res.status(201).json({
      id: `sim-${Date.now()}`,
      status: 'completed',
      results: {
        particles: 1000,
        iterations: 100,
        energy: 0.3,
        momentum: 0.7
      }
    });
  }, 2000); // Simulate 2 second processing time
});

// Mock notebook endpoint
app.post('/api/research/notebook/start', (req, res) => {
  console.log('Received notebook start request:', req.body);
  
  // Mock response
  res.json({
    success: true,
    server: {
      url: 'http://localhost:8888/?token=mock-token-12345',
      port: 8888,
      token: 'mock-token-12345'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`CosmosCode server running at http://localhost:${port}`);
});
EOL
fi

# Install minimal dependencies if package.json doesn't exist
if [ ! -f "package.json" ]; then
    echo "package.json not found. Creating a minimal version..."
    cat > package.json << 'EOL'
{
  "name": "cosmoscode",
  "version": "1.0.0",
  "description": "Cosmology and Medicine Codebase",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOL

    echo "Installing minimal dependencies..."
    npm install --no-proxy
fi

# Start the application
echo "Starting CosmosCode application..."
node src/index.js