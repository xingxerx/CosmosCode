const { NetworkSimulation } = require('./js-implementation/network-simulation');
const cppAddon = require('./cpp-addon');

// Test both implementations
function testImplementation(name, implementation) {
  console.log(`\n=== Testing ${name} implementation ===`);
  
  // Add nodes
  const server = implementation.addNode("server-1", "server", "192.168.1.1");
  const router = implementation.addNode("router-1", "router", "192.168.1.254");
  const client1 = implementation.addNode("client-1", "client", "192.168.1.100");
  const client2 = implementation.addNode("client-2", "client", "192.168.1.101");
  
  // Activate nodes
  implementation.activateNode(server);
  implementation.activateNode(router);
  implementation.activateNode(client1);
  implementation.activateNode(client2);
  
  // Print node info
  console.log("Server info:", implementation.getNodeInfo(server));
  console.log("Client info:", implementation.getNodeInfo(client1));
  
  // Send data
  const success = implementation.sendData(client1, server, "GET /api/data");
  console.log("Data sent successfully:", success);
  
  // Deactivate a node and try to send data
  implementation.deactivateNode(server);
  const failed = implementation.sendData(client1, server, "GET /api/status");
  console.log("Data sent successfully:", failed);
}

// Test JavaScript implementation
const jsSimulation = new NetworkSimulation();
testImplementation("JavaScript", jsSimulation);

// Test C++ addon implementation
const cppSimulation = new cppAddon.NetworkSimulation();
testImplementation("C++ addon", cppSimulation);

console.log("\nIntegration tests completed");
