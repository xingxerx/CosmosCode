/**
 * Network Terminal - Interactive CLI for the Simulated Internet
 */
const readline = require('readline');
const SimulatedInternet = require('./simulated-internet');
const DNSService = require('./dns-service');
const NetworkMonitor = require('./network-monitor');

// Create the simulated internet
const internet = new SimulatedInternet();
const dns = new DNSService();
const monitor = new NetworkMonitor(internet);

// Set up event listeners for network events
internet.on('message-delivered', ({ packet, to }) => {
  console.log(`\n[EVENT] Message delivered: ${packet.id} from ${packet.from} to ${to}`);
});

internet.on('packet-lost', ({ packet }) => {
  console.log(`\n[EVENT] Packet lost: ${packet.id} from ${packet.from} to ${packet.to}`);
});

internet.on('node-online', ({ id }) => {
  console.log(`\n[EVENT] Node online: ${id}`);
});

internet.on('node-offline', ({ id }) => {
  console.log(`\n[EVENT] Node offline: ${id}`);
});

internet.on('network-started', () => {
  console.log('\n[EVENT] Network has started.');
});

internet.on('network-stopped', () => {
  console.log('\n[EVENT] Network has stopped.');
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'network> '
});

// Available commands
const commands = {
  help: {
    description: 'Show available commands',
    handler: () => {
      console.log('\nAvailable commands:');
      Object.keys(commands).forEach(cmd => {
        console.log(`  ${cmd.padEnd(15)} - ${commands[cmd].description}`);
      });
      console.log();
    }
  },
  
  start: {
    description: 'Start the network',
    handler: () => {
      if (internet.running) {
        console.log('Network is already running.');
        return;
      }
      internet.start();
    }
  },
  
  stop: {
    description: 'Stop the network',
    handler: () => {
      if (!internet.running) {
        console.log('Network is already stopped.');
        return;
      }
      internet.stop();
    }
  },
  
  'create-node': {
    description: 'Create a new node (create-node <id> [type])',
    handler: (args) => {
      const [id, type = 'client'] = args;
      if (!id) {
        console.log('Error: Node ID is required');
        return;
      }
      
      try {
        const node = internet.createNode(id, type);
        console.log(`Node created: ${id} (${type}) with IP ${node.ip}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'start-node': {
    description: 'Start a node (start-node <id>)',
    handler: (args) => {
      const [id] = args;
      if (!id) {
        console.log('Error: Node ID is required');
        return;
      }
      
      try {
        internet.startNode(id);
        console.log(`Node started: ${id}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'stop-node': {
    description: 'Stop a node (stop-node <id>)',
    handler: (args) => {
      const [id] = args;
      if (!id) {
        console.log('Error: Node ID is required');
        return;
      }
      
      try {
        internet.stopNode(id);
        console.log(`Node stopped: ${id}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  connect: {
    description: 'Connect two nodes (connect <source> <target>)',
    handler: (args) => {
      const [source, target] = args;
      if (!source || !target) {
        console.log('Error: Source and target IDs are required');
        return;
      }
      
      try {
        const connection = internet.connect(source, target);
        console.log(`Connection established: ${source} → ${target} (Latency: ${connection.latency}ms)`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'send-message': {
    description: 'Send a message (send-message <from> <to> <message>)',
    handler: (args) => {
      const [from, to, ...messageParts] = args;
      if (!from || !to || messageParts.length === 0) {
        console.log('Error: From, to, and message are required');
        return;
      }
      
      const message = messageParts.join(' ');
      
      try {
        const messageId = internet.sendMessage(from, to, { text: message });
        console.log(`Message sent with ID: ${messageId}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'send-routed': {
    description: 'Send a message with routing (send-routed <from> <to> <message>)',
    handler: (args) => {
      const [from, to, ...messageParts] = args;
      if (!from || !to || messageParts.length === 0) {
        console.log('Error: From, to, and message are required');
        return;
      }
      
      const message = messageParts.join(' ');
      
      try {
        const messageId = internet.sendRoutedMessage(from, to, { text: message });
        console.log(`Routed message sent with ID: ${messageId}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'register-domain': {
    description: 'Register a domain (register-domain <domain> <nodeId>)',
    handler: (args) => {
      const [domain, nodeId] = args;
      if (!domain || !nodeId) {
        console.log('Error: Domain and node ID are required');
        return;
      }
      
      try {
        const node = internet.nodes.get(nodeId);
        if (!node) {
          console.log(`Error: Node ${nodeId} not found`);
          return;
        }
        
        dns.registerDomain(domain, nodeId, node.ip);
        console.log(`Domain registered: ${domain} → ${nodeId} (${node.ip})`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'resolve-domain': {
    description: 'Resolve a domain name (resolve-domain <domain>)',
    handler: (args) => {
      const [domain] = args;
      if (!domain) {
        console.log('Error: Domain is required');
        return;
      }
      
      try {
        const ip = dns.resolve(domain);
        console.log(`Domain ${domain} resolves to ${ip}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  
  'list-nodes': {
    description: 'List all nodes',
    handler: () => {
      if (internet.nodes.size === 0) {
        console.log('No nodes found');
        return;
      }
      
      console.log('\nNodes:');
      for (const [id, node] of internet.nodes.entries()) {
        console.log(`- ${id} (${node.type}): IP ${node.ip}, Status: ${node.status}`);
      }
      console.log();
    }
  },
  
  'list-connections': {
    description: 'List all connections',
    handler: () => {
      if (internet.connections.size === 0) {
        console.log('No connections found');
        return;
      }
      
      console.log('\nConnections:');
      for (const [id, conn] of internet.connections.entries()) {
        console.log(`- ${id}: ${conn.source} → ${conn.target}, Latency: ${conn.latency}ms`);
      }
      console.log();
    }
  },
  
  'list-domains': {
    description: 'List all registered domains',
    handler: () => {
      const domains = dns.listDomains();
      if (domains.length === 0) {
        console.log('No domains registered');
        return;
      }
      
      console.log('\nRegistered Domains:');
      domains.forEach(domain => {
        const record = dns.domains.get(domain);
        console.log(`- ${domain} → ${record.nodeId} (${record.ip})`);
      });
      console.log();
    }
  },
  
  stats: {
    description: 'Show network statistics',
    handler: () => {
      const stats = monitor.getNetworkStats();
      console.log('\nNetwork Statistics:');
      console.log(`- Active Nodes: ${stats.activeNodes}`);
      console.log(`- Messages Delivered: ${stats.messagesDelivered}`);
      console.log(`- Messages Lost: ${stats.messagesLost}`);
      console.log(`- Average Latency: ${stats.averageLatency.toFixed(2)}ms`);
      console.log(`- Packet Loss Rate: ${(stats.packetLossRate * 100).toFixed(2)}%`);
      console.log();
    }
  },
  
  setup: {
    description: 'Set up a basic network topology',
    handler: () => {
      const nodesToCreate = [
        { id: 'router-1', type: 'router' },
        { id: 'server-1', type: 'server' },
        { id: 'server-2', type: 'server' },
        { id: 'client-1', type: 'client' },
        { id: 'client-2', type: 'client' }
      ];

      const connectionsToMake = [
        { source: 'router-1', target: 'server-1' },
        { source: 'router-1', target: 'server-2' },
        { source: 'router-1', target: 'client-1' },
        { source: 'router-1', target: 'client-2' }
      ];

      const domainsToRegister = [
        { domain: 'server1.cosmos', nodeId: 'server-1' },
        { domain: 'server2.cosmos', nodeId: 'server-2' }
      ];

      console.log('\nSetting up basic network topology...');

      // Create nodes
      nodesToCreate.forEach(nodeInfo => {
        try {
          if (!internet.nodes.has(nodeInfo.id)) {
            internet.createNode(nodeInfo.id, nodeInfo.type);
            console.log(`  Node created: ${nodeInfo.id} (${nodeInfo.type})`);
          } else {
            console.log(`  Node already exists: ${nodeInfo.id}`);
          }
        } catch (error) {
          console.log(`  Error creating node ${nodeInfo.id}: ${error.message}`);
        }
      });

      // Connect nodes
      connectionsToMake.forEach(connInfo => {
        try {
          internet.connect(connInfo.source, connInfo.target);
          console.log(`  Connection: ${connInfo.source} -> ${connInfo.target}`);
        } catch (error) {
          console.log(`  Error connecting ${connInfo.source} to ${connInfo.target}: ${error.message}`);
        }
      });

      // Register domains
      domainsToRegister.forEach(domainInfo => {
        try {
          const node = internet.nodes.get(domainInfo.nodeId);
          if (node && !dns.domains.has(domainInfo.domain)) {
            dns.registerDomain(domainInfo.domain, domainInfo.nodeId, node.ip);
            console.log(`  Domain registered: ${domainInfo.domain} -> ${domainInfo.nodeId}`);
          } else if (dns.domains.has(domainInfo.domain)) {
            console.log(`  Domain already registered: ${domainInfo.domain}`);
          } else if (!node) {
            console.log(`  Cannot register domain ${domainInfo.domain}, node ${domainInfo.nodeId} not found.`);
          }
        } catch (error) {
          console.log(`  Error registering domain ${domainInfo.domain}: ${error.message}`);
        }
      });

      // Start all nodes that were part of this setup if they aren't already online
      nodesToCreate.forEach(nodeInfo => {
        const node = internet.nodes.get(nodeInfo.id);
        if (node && node.status === 'offline') {
          try {
            internet.startNode(nodeInfo.id);
            // Event 'node-online' will log this
          } catch (error) {
            console.log(`  Error starting node ${nodeInfo.id}: ${error.message}`);
          }
        }
      });

      console.log('\nBasic network topology setup process complete.');
    }
  },
  
  clear: {
    description: 'Clear the console',
    handler: () => {
      console.clear();
    }
  },
  
  exit: {
    description: 'Exit the terminal',
    handler: () => {
      console.log('Goodbye!');
      rl.close();
      process.exit(0);
    }
  }
};

// Process commands
rl.on('line', (line) => {
  const [command, ...args] = line.trim().split(' ');
  
  if (command === '') {
    rl.prompt();
    return;
  }
  
  if (commands[command]) {
    commands[command].handler(args);
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Type "help" to see available commands');
  }
  
  rl.prompt();
}).on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});

// Print welcome message
console.log('\n=== Network Terminal ===');
console.log('Type "help" to see available commands.'); // Added a period for consistency
console.log('Type "setup" to create a basic network topology');
console.log('Type "exit" to quit');
console.log();

// Start the prompt
rl.prompt();