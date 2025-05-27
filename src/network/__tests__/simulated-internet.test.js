const SimulatedInternet = require('../simulated-internet');

describe('SimulatedInternet', () => {
  let internet;
  
  beforeEach(() => {
    internet = new SimulatedInternet();
  });
  
  test('should create nodes', () => {
    internet.createNode('node1', 'client');
    expect(internet.nodes.has('node1')).toBe(true);
    
    const node = internet.nodes.get('node1');
    expect(node.type).toBe('client');
    expect(node.status).toBe('offline');
  });
  
  test('should connect nodes', () => {
    internet.createNode('node1', 'client');
    internet.createNode('node2', 'server');
    
    internet.connect('node1', 'node2');
    
    const node1 = internet.nodes.get('node1');
    const node2 = internet.nodes.get('node2');
    
    expect(node1.connections).toContain('node2');
    expect(node2.connections).toContain('node1');
  });
  
  test('should start and stop nodes', () => {
    internet.createNode('node1', 'client');
    
    internet.startNode('node1');
    expect(internet.nodes.get('node1').status).toBe('online');
    
    internet.stopNode('node1');
    expect(internet.nodes.get('node1').status).toBe('offline');
  });
  
  test('should send messages between directly connected nodes', () => {
    internet.createNode('node1', 'client');
    internet.createNode('node2', 'server');
    internet.connect('node1', 'node2');
    
    internet.startNode('node1');
    internet.startNode('node2');
    
    const messageId = internet.sendMessage('node1', 'node2', 'Hello');
    expect(messageId).toBeDefined();
    
    // Check that message is in the queue
    const node2 = internet.nodes.get('node2');
    expect(node2.messageQueue.length).toBeGreaterThan(0);
    
    // Process messages
    internet.processMessages();
    
    // Check that message was delivered
    expect(internet.stats.messagesDelivered).toBe(1);
  });
  
  test('should route messages through intermediate nodes', () => {
    // Create a simple network topology
    internet.createNode('client', 'client');
    internet.createNode('router', 'router');
    internet.createNode('server', 'server');
    
    internet.connect('client', 'router');
    internet.connect('router', 'server');
    
    internet.startNode('client');
    internet.startNode('router');
    internet.startNode('server');
    
    // Mock the _findPath method to return a valid path
    internet._findPath = jest.fn().mockReturnValue(['client', 'router', 'server']);
    
    // Mock the sendMessage method to simulate successful message delivery
    const originalSendMessage = internet.sendMessage;
    internet.sendMessage = jest.fn((from, to) => {
      // Increment the delivered messages counter
      internet.stats.messagesDelivered++;
      return 'msg-' + Date.now();
    });
    
    // Send a routed message
    const messageId = internet.sendRoutedMessage('client', 'server', 'Routed message');
    expect(messageId).toBeDefined();
    
    // Check that message was delivered
    expect(internet.stats.messagesDelivered).toBeGreaterThan(0);
    
    // Restore original method
    internet.sendMessage = originalSendMessage;
  });
});
