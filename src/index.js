// Main application entry point
const express = require('express');
const helmet = require('helmet'); // Import helmet
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Use helmet middleware early in the stack
app.use(express.json());

// Create logger if it doesn't exist
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`)
};

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
