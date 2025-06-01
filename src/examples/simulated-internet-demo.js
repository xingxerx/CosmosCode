/**
 * Simulated Internet Demo
 * 
 * This example demonstrates how to use the simulated internet components
 * to create a virtual network with web servers, clients, and DNS.
 */

const SimulatedInternet = require('../network/simulated-internet');
const DNSService = require('../network/dns-service');
const WebServer = require('../network/web-server');
const BrowserClient = require('../network/browser-client');
const TopologyManager = require('../network/topology-manager');
const NetworkMonitor = require('../network/network-monitor');

// Create the simulated internet
const internet = new SimulatedInternet({
  latency: { min: 10, max: 100 },
  packetLoss: 0.005,
  bandwidth: 1024 * 1024 * 10 // 10 MB/s
});

// Create DNS service
const dns = new DNSService();

// Create network monitor
const monitor = new NetworkMonitor(internet);

// Create network topology
const topology = new TopologyManager(internet);

// Create a star topology with a central router
const network = topology.createStarTopology('main-router', 5, {
  centerType: 'router',
  leafPrefix: 'server',
  leafType: 'server'
});

// Create web servers
const servers = [];
for (let i = 0; i < 3; i++) {
  const serverId = `server-${i + 1}`;
  const server = new WebServer(serverId, { port: 80 });
  
  // Add some routes and content
  server.addStaticFile('/', `<html><body><h1>Welcome to Server ${i + 1}</h1><p>This is a simulated web server.</p></body></html>`);
  server.addStaticFile('/about', `<html><body><h1>About Server ${i + 1}</h1><p>This server is part of the CosmosCode simulated internet.</p></body></html>`);
  
  server.addRoute('/api/data', 'GET', () => {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        server: i + 1,
        time: new Date().toISOString(),
        data: { value: Math.random() * 100 }
      })
    };
  });
  
  // Register domain in DNS
  const domain = `server${i + 1}.cosmos`;
  const node = internet.nodes.get(serverId);
  dns.registerDomain(domain, serverId, node.ip);
  
  // Start the server
  server.start();
  servers.push({ id: serverId, server, domain });
}

// Create client nodes
const clients = [];
for (let i = 0; i < 3; i++) {
  const clientId = `client-${i + 1}`;
  internet.createNode(clientId, 'client');
  internet.connect('main-router', clientId);
  
  const browser = new BrowserClient(clientId, {
    internet,
    dnsService: dns
  });
  
  clients.push({ id: clientId, browser });
}

// Start the internet
internet.start();

// Start all nodes
for (const { id } of servers) {
  internet.startNode(id);
}

for (const { id } of clients) {
  internet.startNode(id);
}

// Simulate browsing
async function simulateBrowsing() {
  console.log('Starting simulated browsing...');
  
  for (const client of clients) {
    // Pick a random server to visit
    const randomServer = servers[Math.floor(Math.random() * servers.length)];
    const url = `http://${randomServer.domain}/`;
    
    console.log(`Client ${client.id} is visiting ${url}`);
    const response = await client.browser.navigate(url);
    
    console.log(`Client ${client.id} received response with status ${response.status}`);
    
    // Visit another page
    const apiUrl = `http://${randomServer.domain}/api/data`;
    console.log(`Client ${client.id} is requesting ${apiUrl}`);
    const apiResponse = await client.browser.navigate(apiUrl);
    
    console.log(`Client ${client.id} received API data:`, apiResponse.body);
  }
  
  // Print network statistics
  const report = monitor.generateReport();
  console.log('\nNetwork Report:');
  console.log(`Active Nodes: ${report.networkStats.activeNodes}`);
  console.log(`Messages Delivered: ${report.networkStats.messagesDelivered}`);
  console.log(`Messages Lost: ${report.networkStats.messagesLost}`);
  console.log(`Average Latency: ${report.networkStats.averageLatency.toFixed(2)}ms`);
  console.log(`Packet Loss Rate: ${(report.networkStats.packetLossRate * 100).toFixed(2)}%`);
  
  console.log('\nTop Active Nodes:');
  report.topNodes.forEach(([nodeId, stats]) => {
    console.log(`${nodeId}: Sent ${stats.messagesSent || 0}, Received ${stats.messagesReceived || 0}`);
  });
}

// Run the simulation
simulateBrowsing().catch(console.error);

module.exports = {
  internet,
  dns,
  servers,
  clients,
  monitor,
  simulateBrowsing
};