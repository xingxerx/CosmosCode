const SimulatedInternet = require('../simulated-internet');

describe('SimulatedInternet', () => {
  let internet;

  beforeEach(() => {
    internet = new SimulatedInternet();
  });

  test('should create nodes', () => {
    const node = internet.createNode('test-node', 'client');
    expect(node).toBeDefined();
    expect(node.id).toBe('test-node');
    expect(node.type).toBe('client');
    expect(node.connections).toEqual([]);
    expect(node.status).toBe('offline');
  });

  test('should connect nodes', () => {
    internet.createNode('node1', 'client');
    internet.createNode('node2', 'server');
    
    const connection = internet.connect('node1', 'node2');
    
    expect(connection).toBeDefined();
    expect(connection.source).toBe('node1');
    expect(connection.target).toBe('node2');
    
    // Check that connections are stored in both nodes
    const node1 = internet.nodes.get('node1');
    const node2 = internet.nodes.get('node2');
    
    expect(node1.connections).toContain('node2');
    expect(node2.connections).toContain('node1');
  });

  test('should start and stop nodes', () => {
    const node = internet.createNode('test-node', 'client');
    expect(node.status).toBe('offline');
    
    internet.startNode('test-node');
    expect(internet.nodes.get('test-node').status).toBe('online');
    
    internet.stopNode('test-node');
    expect(internet.nodes.get('test-node').status).toBe('offline');
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
    
    // Send a routed message
    const messageId = internet.sendRoutedMessage('client', 'server', 'Routed message');
    expect(messageId).toBeDefined();
    
    // Process messages to allow routing
    internet.processMessages();
    internet.processMessages(); // Process the second hop
    
    // Check that message was delivered
    expect(internet.stats.messagesDelivered).toBeGreaterThan(0);
  });
});
