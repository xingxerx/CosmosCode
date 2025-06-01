const NetworkSimulation = require('./network-simulation');

function runTest() {
  console.log('Running JavaScript network simulation...');
  
  const simulation = new NetworkSimulation();
  
  // Add nodes
  const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
  const clientIndex = simulation.addNode('client-1', 'client', '192.168.1.100');
  
  // Activate nodes
  simulation.activateNode(serverIndex);
  simulation.activateNode(clientIndex);
  
  // Get node info
  const serverInfo = simulation.getNodeInfo(serverIndex);
  console.log('Server info:', serverInfo);
  
  const clientInfo = simulation.getNodeInfo(clientIndex);
  console.log('Client info:', clientInfo);
  
  // Send data
  const successResult = simulation.sendData(serverIndex, clientIndex, 'Hello, client!');
  console.log('Data sent successfully:', successResult);
  
  // Deactivate client and try to send data again
  simulation.deactivateNode(clientIndex);
  const failResult = simulation.sendData(serverIndex, clientIndex, 'Hello again!');
  console.log('Data sent successfully:', failResult);
  
  console.log('JS implementation test completed');
}

runTest();
