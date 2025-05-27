const express = require('express');
const helmet = require('helmet');
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simulation routes
app.get('/api/simulations', (req, res) => {
  res.json({ simulations: [] });
});

app.post('/api/simulations', (req, res) => {
  res.status(201).json({
    id: `sim-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
});

app.get('/api/simulations/:id', (req, res) => {
  res.json({
    id: req.params.id,
    status: 'completed',
    results: {
      particles: 1000,
      iterations: 100
    }
  });
});

app.delete('/api/simulations/:id', (req, res) => {
  res.status(204).send();
});

// Export for testing
module.exports = app;