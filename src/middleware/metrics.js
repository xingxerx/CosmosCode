const promClient = require('prom-client');
const express = require('express');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const simulationDurationSeconds = new promClient.Histogram({
  name: 'simulation_duration_seconds',
  help: 'Duration of cosmology simulations in seconds',
  labelNames: ['type', 'complexity'],
  buckets: [1, 5, 10, 30, 60, 300, 600]
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(simulationDurationSeconds);

// Middleware to track HTTP request durations
function metricsMiddleware(req, res, next) {
  const end = httpRequestDurationMicroseconds.startTimer();
  
  res.on('finish', () => {
    end({ 
      method: req.method, 
      route: req.route?.path || req.path, 
      status: res.statusCode 
    });
  });
  
  next();
}

// Metrics endpoint
const metricsEndpoint = express.Router();
metricsEndpoint.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = { 
  metricsMiddleware, 
  metricsEndpoint, 
  simulationDurationSeconds 
};