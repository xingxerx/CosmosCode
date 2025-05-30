const NetworkSimulation = require('./network-simulation');

// Create a new simulation
const simulation = new NetworkSimulation();

console.log("Network Simulation in JavaScript");
console.log("-------------------------------");

// Add nodes
const server = simulation.addNode("server-1", "server", "192.168.1.1");
const router = simulation.addNode("router-1", "router", "192.168.1.254");
const client1 = simulation.addNode("client-1", "client", "192.168.1.100");
const client2 = simulation.addNode("client-2", "client", "192.168.1.101");

// Activate nodes
simulation.activateNode(server);
simulation.activateNode(router);
simulation.activateNode(client1);
simulation.activateNode(client2);

// Connect nodes
simulation.connectNodes(client1, router);
simulation.connectNodes(client2, router);
simulation.connectNodes(router, server);

console.log("\nNode information:");
console.log("Server:", simulation.getNodeInfo(server));
console.log("Router:", simulation.getNodeInfo(router));
console.log("Client 1:", simulation.getNodeInfo(client1));

console.log("\nSimulating network traffic:");
// Simulate some network traffic
simulation.sendData(client1, server, "GET /api/data");
simulation.sendData(server, client1, "200 OK: {\"data\": [1, 2, 3]}");
simulation.sendData(client2, server, "POST /api/update");
simulation.sendData(server, client2, "201 Created");

// Deactivate a node and try to send data
simulation.deactivateNode(server);
simulation.sendData(client1, server, "GET /api/status");

console.log("\nNetwork simulation completed");