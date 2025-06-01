const { NetworkProcessSimulation } = require('./network-process-wrapper');

async function runTest() {
  console.log('Running network simulation...');
  
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
    console.log('Server info:', serverInfo);
    
    const clientInfo = await simulation.getNodeInfo(clientIndex);
    console.log('Client info:', clientInfo);
    
    // Send data
    const successResult = await simulation.sendData(serverIndex, clientIndex, 'Hello, client!');
    console.log('Data sent successfully:', successResult);
    
    // Deactivate client and try to send data again
    await simulation.deactivateNode(clientIndex);
    const failResult = await simulation.sendData(serverIndex, clientIndex, 'Hello again!');
    console.log('Data sent successfully:', failResult);
    
    // Close the simulation
    simulation.close();
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTest();
