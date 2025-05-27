/**
 * Simple test script for the simulated internet
 */
const SimulatedInternet = require('./simulated-internet');
const DNSService = require('./dns-service');

// Create a simple network
const internet = new SimulatedInternet();
const dns = new DNSService();

// Add some nodes
internet.createNode('router-1', 'router');
internet.createNode('server-1', 'server');
internet.createNode('client-1', 'client');

// Connect them
internet.connect('router-1', 'server-1');
internet.connect('router-1', 'client-1');

// Register a domain
dns.registerDomain('test.cosmos', 'server-1', internet.nodes.get('server-1').ip);

// Start the network
internet.start();
internet.startNode('router-1');
internet.startNode('server-1');
internet.startNode('client-1');

// Print network information
console.log('Network created with:');
console.log(`- ${internet.nodes.size} nodes`);
console.log(`- ${internet.connections.size} connections`);
console.log('\nNodes:');
for (const [id, node] of internet.nodes.entries()) {
  console.log(`- ${id} (${node.type}): IP ${node.ip}, Status: ${node.status}`);
}

console.log('\nConnections:');
for (const [id, conn] of internet.connections.entries()) {
  console.log(`- ${id}: ${conn.source} → ${conn.target}, Latency: ${conn.latency}ms`);
}

console.log('\nDNS Records:');
console.log(dns.listDomains());

// Send a test message
console.log('\nSending test message...');
const messageId = internet.sendMessage('client-1', 'server-1', {
  type: 'request',
  method: 'GET',
  path: '/',
  headers: {}
});

console.log(`Message sent with ID: ${messageId}`);