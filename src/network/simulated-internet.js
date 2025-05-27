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
    
    this.connections.set(connectionId, connection);
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
    const connId1 = `${fromId}-${toId}`;
    const connId2 = `${toId}-${fromId}`;
    const connection = this.connections.get(connId1) || this.connections.get(connId2);

    if (!connection) {
      // This should ideally not be reached if the `source.connections.includes(toId)` check passed.
      throw new Error(`Internal error: Connection object not found for link ${fromId}-${toId}.`);
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
    } catch (error) {
      throw new Error(`Error in first hop: ${error.message}`);
    }
    
    // Schedule subsequent hops
    for (let i = 1; i < path.length - 1; i++) {
      const currentNodeId = path[i];
      const nextNodeId = path[i + 1];
      
      // Get connection for latency calculation
      const connectionId = `${path[i-1]}-${currentNodeId}`;
      const connection = this.connections.get(connectionId);
      
      if (!connection) {
        console.error(`Warning: Connection ${connectionId} not found for latency calculation`);
        continue;
      }
      
      const hopDelay = connection.latency + 10; // Add processing time
      
      // Use closure to capture the current values
      ((currentNodeId, nextNodeId, hopIndex) => {
        setTimeout(() => {
          try {
            if (hopIndex === path.length - 2) {
              // Last hop - deliver the original message
              const finalHopId = this.sendMessage(currentNodeId, nextNodeId, message);
              
              this.emit('message-routed', {
                originalSource: fromId,
                finalDestination: toId,
                path: path,
                messageId: finalHopId
              });
            } else {
              // Intermediate hop - forward the routing information
              this.sendMessage(currentNodeId, nextNodeId, {
                type: 'routed-message',
                originalSource: fromId,
                finalDestination: toId,
                path: path,
                currentHop: hopIndex + 1,
                data: message
              });
            }
          } catch (error) {
            this.emit('routing-error', {
              originalSource: fromId,
              currentNode: currentNodeId,
              nextNode: nextNodeId,
              finalDestination: toId,
              error: error.message
            });
          }
        }, hopDelay);
      })(currentNodeId, nextNodeId, i);
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
          const neighbor = this.nodes.get(neighborId);
          
          // Only consider online nodes and routers for intermediate hops
          if (neighbor && 
              (neighbor.status === 'online') && 
              (neighborId === endId || neighbor.type === 'router')) {
            const newPath = [...path, neighborId];
            queue.push(newPath);
          }
        }
      }
    }
    
    return null; // No path found
  }

  // Helper methods
  _generateIP() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  _calculateLatency() {
    return Math.floor(Math.random() * (this.latency.max - this.latency.min)) + this.latency.min;
  }
}

module.exports = SimulatedInternet;
