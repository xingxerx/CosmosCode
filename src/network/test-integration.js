const NetworkSimulation = require('./js-implementation/network-simulation');
const { NetworkProcessSimulation } = require('./cpp-process/network-process-wrapper');

async function runTest() {
  console.log('=== Testing JavaScript implementation ===');
  testJsImplementation();
  
  console.log('\n=== Testing C++ addon implementation ===');
  try {
    await testCppImplementation();
  } catch (error) {
    console.error('C++ implementation test failed:', error.message);
  }
  
  console.log('\nIntegration tests completed');
}

function testJsImplementation() {
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
}

async function testCppImplementation() {
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
}

runTest();
