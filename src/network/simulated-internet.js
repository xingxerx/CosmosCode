/**
 * Simulated Internet Module for CosmosCode
 * 
 * This module creates a virtual network environment for testing and development.
 */

const EventEmitter = require('events');
const crypto = require('crypto');

class SimulatedInternet extends EventEmitter {
  constructor(options = {}) {
    super();
    this.nodes = new Map();
    this.connections = new Map();
    this.latency = options.latency || { min: 20, max: 200 }; // ms
    this.packetLoss = options.packetLoss || 0.01; // 1% packet loss
    this.bandwidth = options.bandwidth || 1024 * 1024; // 1 MB/s
    this.running = false;
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
  sendMessage(fromId, toId, message) {
    const source = this.nodes.get(fromId);
    const target = this.nodes.get(toId);
    
    if (!source || !target) {
      throw new Error('Source or target node not found');
    }
    
    if (source.status === 'offline') {
      throw new Error('Source node is offline');
    }
    
    // Check if nodes are connected
    if (!source.connections.includes(toId)) {
      throw new Error(`No connection between ${fromId} and ${toId}`);
    }
    
    const packet = {
      id: crypto.randomUUID(),
      from: fromId,
      to: toId,
      data: message,
      timestamp: Date.now(),
      size: JSON.stringify(message).length
    };
    
    // Simulate network conditions
    const connId = `${fromId}-${toId}`;
    const connection = this.connections.get(connId);

    if (!connection) {
      throw new Error(`Connection object not found for link ${fromId}-${toId}`);
    }
    
    // Check for packet loss
    if (Math.random() < connection.packetLoss) {
      this.emit('packet-lost', { packet });
      return null;
    }
    
    // Calculate delivery time based on latency and bandwidth
    const deliveryTime = connection.latency + (packet.size / connection.bandwidth * 1000);
    
    // Queue the message for delivery
    setTimeout(() => {
      if (target.status === 'online') {
        target.messageQueue.push(packet);
        this.emit('message-delivered', { packet, to: toId });
      } else {
        this.emit('delivery-failed', { packet, reason: 'target-offline' });
      }
    }, deliveryTime);
    
    return packet.id;
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
}

module.exports = SimulatedInternet;
