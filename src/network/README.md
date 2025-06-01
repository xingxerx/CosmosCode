# Network Simulation Framework

This framework provides tools for simulating computer networks with various components and behaviors.

## Components

- **NetworkSimulation**: Basic JavaScript implementation of network simulation
- **SimulatedInternet**: Advanced network simulation with packet loss, latency, and routing
- **EnhancedNetworkSimulation**: Combined implementation with features from both
- **NetworkVisualizer**: Visualization tools for network topologies
- **C++ Implementation**: High-performance native implementation

## Getting Started

### Basic Usage

```javascript
const NetworkSimulation = require('./js-implementation/network-simulation');

// Create a simulation
const simulation = new NetworkSimulation();

// Add nodes
const serverIndex = simulation.addNode('server-1', 'server', '192.168.1.1');
const clientIndex = simulation.addNode('client-1', 'client', '192.168.1.100');

// Activate nodes
simulation.activateNode(serverIndex);
simulation.activateNode(clientIndex);

// Send data
const success = simulation.sendData(serverIndex, clientIndex, 'Hello, client!');
console.log('Data sent successfully:', success);
```

### Advanced Usage with SimulatedInternet

```javascript
const SimulatedInternet = require('./simulated-internet');

// Create simulated internet with custom properties
const internet = new SimulatedInternet({
  latency: { min: 10, max: 100 },
  packetLoss: 0.01,
  bandwidth: 5 * 1024 * 1024 // 5 MB/s
});

// Create nodes
internet.createNode('router-1', 'router');
internet.createNode('server-1', 'server');
internet.createNode('client-1', 'client');

// Connect nodes
internet.connect('router-1', 'server-1');
internet.connect('router-1', 'client-1');

// Start the network
internet.start();
internet.startNode('router-1');
internet.startNode('server-1');
internet.startNode('client-1');

// Send a message
const messageId = internet.sendRoutedMessage('client-1', 'server-1', {
  type: 'request',
  method: 'GET',
  path: '/'
});

// Process messages
internet.processMessages();
```

## Node Types

- **client**: End-user devices
- **server**: Service providers
- **router**: Network routing devices
- **firewall**: Security devices
- **loadbalancer**: Traffic distribution devices

## Running Tests

```bash
# Run JavaScript implementation tests
node js-implementation/test-js-simulation.js

# Run integration tests
node test-integration.js

# Run all network tests
npm run test:network
```

## Visualization

The NetworkVisualizer component provides a visual representation of your network:

```javascript
const NetworkVisualizer = require('./visualization/network-visualizer');
const EnhancedNetworkSimulation = require('./enhanced-network-simulation');

// Create simulation
const simulation = new EnhancedNetworkSimulation();

// Set up nodes and connections
// ...

// Create visualizer
const visualizer = new NetworkVisualizer(document.getElementById('network-container'));

// Update visualization from simulation
visualizer.updateFromNetworkSimulation(simulation);
```

## C++ Implementation

For high-performance simulations, use the C++ addon:

```javascript
const networkSimulation = require('./cpp-addon');

// Create a simulation
const simulation = new networkSimulation.NetworkSimulation();

// Add nodes
const server = simulation.addNode("server-1", "server", "192.168.1.1");
const client = simulation.addNode("client-1", "client", "192.168.1.100");

// Activate nodes and send data
simulation.activateNode(server);
simulation.activateNode(client);
simulation.sendData(server, client, "Hello from C++!");
```