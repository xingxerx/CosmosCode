const { NetworkProcessSimulation } = require('./network-process-wrapper');

async function runTest() {
  console.log("Running network simulation...");
  
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
    
    console.log("C++ process implementation test completed");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

runTest();
