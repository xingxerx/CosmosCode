/**
 * Setup Network
 * 
 * This script sets up a basic network topology for testing.
 */

const SimulatedInternet = require('./simulated-internet');
const DNSService = require('./dns-service');
const NetworkPersistence = require('./network-persistence');

// Create instances
const internet = new SimulatedInternet();
const dns = new DNSService();
const persistence = new NetworkPersistence();

// Create nodes
internet.createNode('router-1', 'router');
internet.createNode('router-2', 'router');
internet.createNode('server-1', 'server');
internet.createNode('server-2', 'server');
internet.createNode('client-1', 'client');

// Connect nodes
internet.connect('router-1', 'router-2');
internet.connect('router-1', 'client-1');
internet.connect('client-1', 'router-1');
internet.connect('router-1', 'server-1');
internet.connect('router-2', 'server-2');

// Register domains
const server1 = internet.nodes.get('server-1');
const server2 = internet.nodes.get('server-2');
dns.registerDomain('server1.net', 'server-1', server1.ip);
dns.registerDomain('server2.net', 'server-2', server2.ip);

// Save the network configuration
persistence.saveNetwork(internet, dns);

console.log('Basic network configuration created and saved.');
console.log('You can now run the network terminal to interact with it.');