const NetworkSimulation = require('./index').NetworkSimulation;

// Create a new simulation
console.log("Creating new network simulation...");
const simulation = new NetworkSimulation();

// Add nodes
console.log("\nAdding nodes to the network...");
const server = simulation.addNode("server-1", "server", "192.168.1.1");
const router = simulation.addNode("router-1", "router", "192.168.1.254");
const client1 = simulation.addNode("client-1", "client", "192.168.1.100");
const client2 = simulation.addNode("client-2", "client", "192.168.1.101");

console.log(`Added ${4} nodes to the network`);

// Activate nodes
console.log("\nActivating nodes...");
simulation.activateNode(server);
simulation.activateNode(router);
simulation.activateNode(client1);
simulation.activateNode(client2);

// Print node info
console.log("\nNode Information:");
console.log("Server info:", simulation.getNodeInfo(server));
console.log("Router info:", simulation.getNodeInfo(router));
console.log("Client 1 info:", simulation.getNodeInfo(client1));
console.log("Client 2 info:", simulation.getNodeInfo(client2));

// Send data
console.log("\nSending data from client to server...");
const message = "GET /api/data";
console.log(`Message: "${message}"`);
const success = simulation.sendData(client1, server, message);
console.log("Data sent successfully:", success);

// Send data through router
console.log("\nSending data from client to server through router...");
const routedMessage = "POST /api/update";
console.log(`Message: "${routedMessage}"`);
// Note: In a real implementation, we would need to implement routing logic
const routedSuccess = simulation.sendData(client2, server, routedMessage);
console.log("Data sent successfully:", routedSuccess);

// Deactivate a node and try to send data
console.log("\nDeactivating server and attempting to send data...");
simulation.deactivateNode(server);
console.log("Server active status:", simulation.getNodeInfo(server).active);
const failed = simulation.sendData(client1, server, "GET /api/status");
console.log("Data sent successfully:", failed);

// Reactivate server and try again
console.log("\nReactivating server and retrying...");
simulation.activateNode(server);
console.log("Server active status:", simulation.getNodeInfo(server).active);
const retry = simulation.sendData(client1, server, "GET /api/status");
console.log("Data sent successfully:", retry);

console.log("\nNetwork simulation demo completed.");