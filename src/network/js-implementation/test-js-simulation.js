const NetworkSimulation = require('./network-simulation');

function runTest() {
  console.log("Running JavaScript network simulation...");
  
  const simulation = new NetworkSimulation();
  
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
  
  console.log("JS implementation test completed");
}

runTest();
