const { NetworkSimulation } = require('./network-simulation');

// Create a new simulation
const simulation = new NetworkSimulation();

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

// Print node info
console.log("Server info:", simulation.getNodeInfo(server));
console.log("Client info:", simulation.getNodeInfo(client1));

// Send data
const success = simulation.sendData(client1, server, "GET /api/data");
console.log("Data sent successfully:", success);

// Deactivate a node and try to send data
simulation.deactivateNode(server);
const failed = simulation.sendData(client1, server, "GET /api/status");
console.log("Data sent successfully:", failed);

console.log("JS implementation test completed");
