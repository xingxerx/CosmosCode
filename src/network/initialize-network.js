/**
 * Initialize Network
 * 
 * This script sets up a basic network topology for the simulated internet.
 */

const SimulatedInternet = require('./simulated-internet');
const DNSService = require('./dns-service');
const TopologyManager = require('./topology-manager');
const WebServer = require('./web-server');

function initializeNetwork() {
  // Create simulated internet
  const internet = new SimulatedInternet({
    latency: { min: 10, max: 100 },
    packetLoss: 0.01,
    bandwidth: 1024 * 1024 * 5 // 5 MB/s
  });
  
  // Create DNS service
  const dns = new DNSService();
  
  // Create topology manager
  const topology = new TopologyManager(internet);
  
  // Create a basic network topology
  // 1. Create a backbone with 3 core routers
  const backbone = topology.createMeshTopology(3, {
    nodePrefix: 'core-router',
    nodeType: 'router'
  });
  
  // 2. Create regional networks connected to each core router
  const regions = [];
  for (let i = 0; i < backbone.length; i++) {
    const region = topology.createStarTopology(backbone[i].id, 3, {
      leafPrefix: `region-${i+1}-server`,
      leafType: 'server'
    });
    regions.push(region);
    
    // Add some clients to each region
    const clients = topology.createStarTopology(`region-${i+1}-router`, 5, {
      centerType: 'router',
      leafPrefix: `region-${i+1}-client`,
      leafType: 'client'
    });
    
    // Connect regional router to core router
    internet.connect(backbone[i].id, `region-${i+1}-router`);
  }
  
  // 3. Set up web servers
  const webServers = [];
  for (let i = 0; i < regions.length; i++) {
    for (let j = 0; j < 3; j++) {
      const serverId = `region-${i+1}-server-${j+1}`;
      const server = new WebServer(serverId, { port: 80 });
      
      // Add content to the server
      server.addStaticFile('/', `
        <html>
          <head>
            <title>Region ${i+1} Server ${j+1}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Welcome to Region ${i+1} Server ${j+1}</h1>
            <p>This is a simulated web server in the CosmosCode network.</p>
            <p>Server IP: ${internet.nodes.get(serverId).ip}</p>
            <p>Current time: ${new Date().toISOString()}</p>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/api/status">API Status</a></li>
            </ul>
          </body>
        </html>
      `);
      
      server.addStaticFile('/about', `
        <html>
          <head>
            <title>About - Region ${i+1} Server ${j+1}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>About Region ${i+1} Server ${j+1}</h1>
            <p>This server is part of the CosmosCode simulated internet.</p>
            <p>It demonstrates how web servers work in a network environment.</p>
            <p><a href="/">Back to Home</a></p>
          </body>
        </html>
      `);
      
      server.addRoute('/api/status', 'GET', () => {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            server: `Region ${i+1} Server ${j+1}`,
            uptime: Math.floor(Math.random() * 1000000),
            load: Math.random(),
            memory: {
              total: 8192,
              used: Math.floor(Math.random() * 4096)
            },
            timestamp: new Date().toISOString()
          })
        };
      });
      
      // Register domain in DNS
      const domain = `r${i+1}s${j+1}.cosmos`;
      dns.registerDomain(domain, serverId, internet.nodes.get(serverId).ip);
      
      // Start the server
      server.start();
      webServers.push({ id: serverId, server, domain });
    }
  }
  
  // Start the internet
  internet.start();
  
  // Start all nodes
  for (const [id, node] of internet.nodes.entries()) {
    internet.startNode(id);
  }
  
  return {
    internet,
    dns,
    topology,
    backbone,
    regions,
    webServers
  };
}

module.exports = initializeNetwork;