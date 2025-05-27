// Main application entry point
const express = require('express');
const helmet = require('helmet'); // Import helmet
const app = express();
const port = process.env.PORT || 3000;

// Import simulated internet components
const SimulatedInternet = require('./network/simulated-internet');
const DNSService = require('./network/dns-service');
const NetworkMonitor = require('./network/network-monitor');

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

// Initialize simulated internet
const simulatedInternet = new SimulatedInternet();
const dnsService = new DNSService();
const networkMonitor = new NetworkMonitor(simulatedInternet);

// Basic routes
app.get('/', (req, res) => {
  res.send('CosmosCode API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simulated internet routes
app.get('/api/network/status', (req, res) => {
  res.json(networkMonitor.getNetworkStats());
});

app.get('/api/network/nodes', (req, res) => {
  const nodes = Array.from(simulatedInternet.nodes.entries()).map(([id, node]) => ({
    id,
    type: node.type,
    ip: node.ip,
    status: node.status,
    connections: node.connections.length
  }));
  
  res.json({ nodes });
});

app.get('/api/network/dns', (req, res) => {
  res.json({
    domains: dnsService.listDomains()
  });
});

app.post('/api/network/start', (req, res) => {
  simulatedInternet.start();
  res.json({ status: 'started' });
});

app.post('/api/network/stop', (req, res) => {
  simulatedInternet.stop();
  res.json({ status: 'stopped' });
});

// Start server
app.listen(port, () => {
  logger.info(`CosmosCode server running at http://localhost:${port}`);
  logger.info('Simulated internet available at /api/network endpoints');
});
