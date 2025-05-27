const EventEmitter = require('events');

/**
 * Simulated Internet class for network simulations
 */
class SimulatedInternet extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // Network components
    this.nodes = new Map();
    this.connections = new Map();
    
    // Network properties
    this.packetLoss = options.packetLoss || 0.05; // 5% packet loss by default
    this.bandwidth = options.bandwidth || 1000; // 1000 KB/s by default
    this.running = false;
    
    // Statistics
    this.stats = {
      messagesDelivered: 0,
      messagesLost: 0,
      totalLatency: 0
    };
  }

  // Create a new node in the network
  createNode(id, type = 'client') {
    if (this.nodes.has(id)) {
      throw new Error(`Node with ID ${id} already exists`);
    }
    
    const node = {
      id,
      type,
      ip: this._generateIP(),
      connections: [],
      status: 'offline',
      messageQueue: []
    };
    
    this.nodes.set(id, node);
    return node;
  }

  // Connect two nodes
  connect(sourceId, targetId) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (!source || !target) {
      throw new Error('Source or target node not found');
    }
    
    const connectionId = `${sourceId}-${targetId}`;
    const reverseConnectionId = `${targetId}-${sourceId}`;
    
    if (this.connections.has(connectionId)) {
      return this.connections.get(connectionId);
    }
    
    const connection = {
      id: connectionId,
      source: sourceId,
      target: targetId,
      status: 'established',
      latency: this._calculateLatency(),
      packetLoss: this.packetLoss,
      bandwidth: this.bandwidth
    };
    
    // Store the connection in both directions with the same properties
    this.connections.set(connectionId, connection);
    this.connections.set(reverseConnectionId, {
      ...connection,
      id: reverseConnectionId,
      source: targetId,
      target: sourceId
    });
    
    source.connections.push(targetId);
    target.connections.push(sourceId);
    
    return connection;
  }

  // Send a message from one node to another
  sendMessage(fromId, toId, data) {
    const source = this.nodes.get(fromId);
    const target = this.nodes.get(toId);
    
    if (!source || !target) {
      throw new Error('Source or target node not found');
    }
    
    if (source.status === 'offline') {
      throw new Error('Source node is offline');
    }
    
    // Ensure connections is an array
    if (!Array.isArray(source.connections)) {
      source.connections = Array.from(source.connections || []);
    }
    
    // Check if nodes are directly connected
    if (!source.connections.includes(toId)) {
      throw new Error(`Nodes ${fromId} and ${toId} are not directly connected`);
    }
    
    // Generate a unique message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create the message
    const message = {
      id: messageId,
      from: fromId,
      to: toId,
      data,
      timestamp: Date.now()
    };
    
    // Add message to target's queue
    target.messageQueue.push(message);
    
    // Emit an event for the sent message
    this.emit('message-sent', {
      messageId,
      from: fromId,
      to: toId,
      data
    });
    
    return messageId;
  }

  // Start a node
  startNode(id) {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with ID ${id} not found`);
    }
    
    node.status = 'online';
    this.emit('node-online', { id });
    return node;
  }

  // Stop a node
  stopNode(id) {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with ID ${id} not found`);
    }
    
    node.status = 'offline';
    this.emit('node-offline', { id });
    return node;
  }

  // Start the simulated internet
  start() {
    this.running = true;
    this.emit('network-started');
    return this;
  }

  // Stop the simulated internet
  stop() {
    this.running = false;
    this.emit('network-stopped');
    return this;
  }

  // Send a message with routing through intermediate nodes if needed
  sendRoutedMessage(fromId, toId, message) {
    const source = this.nodes.get(fromId);
    const target = this.nodes.get(toId);
    
    if (!source || !target) {
      throw new Error('Source or target node not found');
    }
    
    if (source.status === 'offline') {
      throw new Error('Source node is offline');
    }
    
    // Check if nodes are directly connected
    if (source.connections.includes(toId)) {
      // Direct connection exists, use regular sendMessage
      return this.sendMessage(fromId, toId, message);
    }
    
    // Find a path through the network using breadth-first search
    const path = this._findPath(fromId, toId);
    
    if (!path || path.length < 2) {
      throw new Error(`No route found between ${fromId} and ${toId}`);
    }
    
    console.log(`Routing message from ${fromId} to ${toId} through path: ${path.join(' → ')}`);
    
    // Send the message through the path
    let currentHopId = null;
    
    // First hop
    try {
      currentHopId = this.sendMessage(path[0], path[1], {
        type: 'routed-message',
        originalSource: fromId,
        finalDestination: toId,
        path: path,
        currentHop: 1,
        data: message
      });
      
      // Emit an event for the first hop
      this.emit('message-routed', {
        originalSource: fromId,
        finalDestination: toId,
        path: path,
        messageId: currentHopId
      });
      
    } catch (error) {
      throw new Error(`Error in first hop: ${error.message}`);
    }
    
    return currentHopId; // Return ID of first hop
  }

  // Helper method to find a path between two nodes using BFS
  _findPath(startId, endId) {
    const visited = new Set();
    const queue = [[startId]];
    
    while (queue.length > 0) {
      const path = queue.shift();
      const currentId = path[path.length - 1];
      
      if (currentId === endId) {
        return path;
      }
      
      if (!visited.has(currentId)) {
        visited.add(currentId);
        
        const currentNode = this.nodes.get(currentId);
        if (!currentNode) continue;
        
        for (const neighborId of currentNode.connections) {
          if (!visited.has(neighborId)) {
            const newPath = [...path, neighborId];
            queue.push(newPath);
          }
        }
      }
    }
    
    return null; // No path found
  }

  // Generate a unique ID for messages
  _generateId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Calculate message size in bytes (simple estimation)
  _calculateMessageSize(message) {
    return JSON.stringify(message).length;
  }

  // Generate a random IP address
  _generateIP() {
    return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  // Calculate random latency within the configured range
  _calculateLatency() {
    const { min, max } = this.latency;
    return Math.floor(min + Math.random() * (max - min));
  }

  // Process all pending messages in the network
  processMessages() {
    let processedCount = 0;
    
    // Process each node's message queue
    for (const [nodeId, node] of this.nodes.entries()) {
      if (node.status === 'offline' || node.messageQueue.length === 0) {
        continue;
      }
      
      // Process each message in the queue
      const messagesToProcess = [...node.messageQueue];
      node.messageQueue = [];
      
      for (const message of messagesToProcess) {
        processedCount++;
        
        // Check if this is a routed message
        if (message.data && message.data.type === 'routed-message') {
          this._processRoutedMessage(nodeId, message);
        } else {
          // Regular message delivery
          this._deliverMessage(message);
        }
      }
    }
    
    return processedCount;
  }

  // Process a routed message
  _processRoutedMessage(currentNodeId, message) {
    const routedData = message.data;
    const path = routedData.path;
    const currentHop = routedData.currentHop;
    
    // Check if we've reached the final destination
    if (currentNodeId === routedData.finalDestination) {
      // Deliver the final message
      this._deliverMessage({
        id: message.id,
        from: routedData.originalSource,
        to: routedData.finalDestination,
        data: routedData.data,
        timestamp: message.timestamp
      });
      return;
    }
    
    // Forward to next hop
    if (currentHop < path.length - 1) {
      const nextHopId = path[currentHop + 1];
      
      try {
        this.sendMessage(currentNodeId, nextHopId, {
          type: 'routed-message',
          originalSource: routedData.originalSource,
          finalDestination: routedData.finalDestination,
          path: path,
          currentHop: currentHop + 1,
          data: routedData.data
        });
      } catch (error) {
        console.error(`Error forwarding routed message: ${error.message}`);
        this.stats.messagesLost++;
      }
    }
  }

  // Helper method to deliver a message and update stats
  _deliverMessage(message) {
    // Calculate actual delivery time based on connection latency
    const sourceId = message.from;
    const targetId = message.to;
    
    // Find the connection between source and target
    const connectionId = `${sourceId}-${targetId}`;
    const connection = this.connections.get(connectionId);
    
    if (!connection) {
      console.error(`Connection ${connectionId} not found for message delivery`);
      this.stats.messagesLost++;
      return;
    }
    
    // Check for packet loss
    const isLost = Math.random() < connection.packetLoss;
    
    if (isLost) {
      this.stats.messagesLost++;
      this.emit('message-lost', {
        messageId: message.id,
        from: sourceId,
        to: targetId,
        reason: 'packet-loss'
      });
      return;
    }
    
    // Message successfully delivered
    this.stats.messagesDelivered++;
    this.stats.totalLatency += connection.latency;
    
    this.emit('message-delivered', {
      messageId: message.id,
      from: sourceId,
      to: targetId,
      data: message.data,
      latency: connection.latency
    });
  }
}

module.exports = SimulatedInternet;
