// Minimal application that doesn't depend on any external modules
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Basic routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
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

// Add a new endpoint for visualization
app.post('/api/visualizations', (req, res) => {
  console.log('Received visualization request:', req.body);
  
  // Mock response
  setTimeout(() => {
    res.status(201).json({
      id: `viz-${Date.now()}`,
      status: 'completed',
      results: {
        imageUrl: 'http://example.com/mock-image.png',
        type: req.body.type || '3D',
        dimensions: [800, 600]
      }
    });
  }, 1500); // Simulate 1.5 second processing time
});

// Start server
app.listen(port, () => {
  console.log(`CosmosCode server running at http://localhost:${port}`);
});
