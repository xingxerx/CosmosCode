const JSNetworkSimulation = require('./js-implementation/network-simulation');
const { NetworkProcessSimulation } = require('./cpp-process/network-process-wrapper');

async function testJSImplementation() {
  console.log("\n=== Testing JavaScript implementation ===");
  
  const simulation = new JSNetworkSimulation();
  
  // Add nodes
  const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
  const clientIndex = simulation.addNode('client-1', 'client', '192.168.1.100');
  
  // Activate nodes
  simulation.activateNode(serverIndex);
  simulation.activateNode(clientIndex);
  
  // Get node info
  const serverInfo = simulation.getNodeInfo(serverIndex);
  const clientInfo = simulation.getNodeInfo(clientIndex);
  
  console.log("Server info:", serverInfo);
  console.log("Client info:", clientInfo);
  
  // Send data
  const sendResult1 = simulation.sendData(clientIndex, serverIndex, "Hello server");
  console.log("Data sent successfully:", sendResult1);
  
  // Deactivate server
  simulation.deactivateNode(serverIndex);
  
  // Try to send data again
  const sendResult2 = simulation.sendData(clientIndex, serverIndex, "Hello again");
  console.log("Data sent successfully:", sendResult2);
}

async function testCppImplementation() {
  console.log("\n=== Testing C++ addon implementation ===");
  
  try {
    const simulation = new NetworkProcessSimulation();
    
    // Add nodes
    const serverIndex = await simulation.addNode('server-1', 'server', '192.168.1.1');
    const clientIndex = await simulation.addNode('client-1', 'client', '192.168.1.100');
    
    // Activate nodes
    await simulation.activateNode(serverIndex);
    await simulation.activateNode(clientIndex);
    
    // Get node info
    const serverInfo = await simulation.getNodeInfo(serverIndex);
    const clientInfo = await simulation.getNodeInfo(clientIndex);
    
    console.log("Server info:", serverInfo);
    console.log("Client info:", clientInfo);
    
    // Send data
    const sendResult1 = await simulation.sendData(clientIndex, serverIndex, "Hello server");
    console.log("Data sent successfully:", sendResult1);
    
    // Deactivate server
    await simulation.deactivateNode(serverIndex);
    
    // Try to send data again
    const sendResult2 = await simulation.sendData(clientIndex, serverIndex, "Hello again");
    console.log("Data sent successfully:", sendResult2);
    
    // Close the simulation
    simulation.close();
  } catch (error) {
    console.error("C++ implementation test failed:", error.message);
  }
}

async function runIntegrationTests() {
  await testJSImplementation();
  await testCppImplementation();
  
  console.log("\nIntegration tests completed");
}

runIntegrationTests();
