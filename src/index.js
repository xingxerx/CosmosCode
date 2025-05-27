// Main application entry point
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Import network components
const initializeNetwork = require('./network/initialize-network');
const NetworkMonitor = require('./network/network-monitor');

// Import routes
const healthRoutes = require('./routes/health');

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Create logger
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`)
};

// Initialize simulated internet
logger.info('Initializing simulated internet...');
const network = initializeNetwork();
const { internet: simulatedInternet, dns: dnsService } = network;
const networkMonitor = new NetworkMonitor(simulatedInternet);

// Basic routes
app.get('/', (req, res) => {
  res.send('CosmosCode API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register routes
app.use('/api/health', healthRoutes);

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

app.get('/api/network/connections', (req, res) => {
  const connections = Array.from(simulatedInternet.connections.entries()).map(([id, conn]) => ({
    id,
    source: conn.source,
    target: conn.target,
    status: conn.status,
    latency: conn.latency,
    bandwidth: conn.bandwidth
  }));
  
  res.json({ connections });
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

// Add a new node
app.post('/api/network/nodes', (req, res) => {
  try {
    const { id, type } = req.body;
    
    if (!id || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const node = simulatedInternet.createNode(id, type);
    res.status(201).json(node);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a new connection
app.post('/api/network/connections', (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    
    if (!sourceId || !targetId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const connection = simulatedInternet.connect(sourceId, targetId);
    res.status(201).json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start a node
app.post('/api/network/start-node/:id', (req, res) => {
  try {
    const { id } = req.params;
    const node = simulatedInternet.startNode(id);
    res.json(node);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stop a node
app.post('/api/network/stop-node/:id', (req, res) => {
  try {
    const { id } = req.params;
    const node = simulatedInternet.stopNode(id);
    res.json(node);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  logger.info(`CosmosCode server running at http://localhost:${port}`);
  logger.info(`Network visualizer available at http://localhost:${port}/network`);
  logger.info(`Simulated internet initialized with ${simulatedInternet.nodes.size} nodes and ${simulatedInternet.connections.size} connections`);
});
