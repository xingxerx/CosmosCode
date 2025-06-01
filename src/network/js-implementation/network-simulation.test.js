const NetworkSimulation = require('./network-simulation');

describe('NetworkSimulation', () => {
  let simulation;
  
  beforeEach(() => {
    simulation = new NetworkSimulation();
  });
  
  test('should create nodes of different types', () => {
    const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
    const routerIndex = simulation.addNode('router-1', 'router', '192.168.1.254');
    const firewallIndex = simulation.addNode('firewall-1', 'firewall', '192.168.1.2');
    const loadBalancerIndex = simulation.addNode('lb-1', 'loadbalancer', '192.168.1.3');
    
    expect(simulation.getNodeInfo(serverIndex).type).toBe('server');
    expect(simulation.getNodeInfo(routerIndex).type).toBe('router');
    expect(simulation.getNodeInfo(firewallIndex).type).toBe('firewall');
    expect(simulation.getNodeInfo(loadBalancerIndex).type).toBe('loadbalancer');
  });
  
  test('should activate and deactivate nodes', () => {
    const nodeIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
    
    expect(simulation.getNodeInfo(nodeIndex).active).toBe(false);
    
    simulation.activateNode(nodeIndex);
    expect(simulation.getNodeInfo(nodeIndex).active).toBe(true);
    
    simulation.deactivateNode(nodeIndex);
    expect(simulation.getNodeInfo(nodeIndex).active).toBe(false);
  });
  
  test('should send data between active nodes', () => {
    const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
    const clientIndex = simulation.addNode('client-1', 'client', '192.168.1.100');
    
    simulation.activateNode(serverIndex);
    simulation.activateNode(clientIndex);
    
    expect(simulation.sendData(serverIndex, clientIndex, 'test data')).toBe(true);
  });
  
  test('should fail to send data when nodes are inactive', () => {
    const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
    const clientIndex = simulation.addNode('client-1', 'client', '192.168.1.100');
    
    // Only activate server, not client
    simulation.activateNode(serverIndex);
    
    expect(simulation.sendData(serverIndex, clientIndex, 'test data')).toBe(false);
  });
});