const NetworkIntegration = require('./network-integration');

async function runTest() {
  // Create network integration with default options
  const network = new NetworkIntegration();
  
  // Define nodes
  const nodes = [
    { id: "server-1", type: "server", ip: "192.168.1.1" },
    { id: "router-1", type: "router", ip: "192.168.1.254" },
    { id: "client-1", type: "client", ip: "192.168.1.100" },
    { id: "client-2", type: "client", ip: "192.168.1.101" }
  ];
  
  // Create simulation
  await network.createSimulation(nodes);
  
  // Activate nodes
  await network.activateNode("server-1");
  await network.activateNode("router-1");
  await network.activateNode("client-1");
  await network.activateNode("client-2");
  
  // Send data
  await network.sendData("client-1", "server-1", "GET /api/data");
  await network.sendData("server-1", "client-1", "200 OK: {\"data\": [1, 2, 3]}");
  
  // Deactivate a node
  await network.deactivateNode("server-1");
  
  // Try to send data to inactive node
  await network.sendData("client-1", "server-1", "GET /api/status");
  
  // Run the simulation (only needed for process implementation)
  await network.runSimulation();
  
  // Get node info
  const serverInfo = await network.getNodeInfo("server-1");
  console.log("Server info:", serverInfo);
  
  const clientInfo = await network.getNodeInfo("client-1");
  console.log("Client info:", clientInfo);
}

runTest().catch(error => {
  console.error("Test failed:", error);
});