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
    const connectionId = `${fromId}-${toId}`;
    const connection = this.connections.get(connectionId);
    
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

  // Helper methods
  _generateIP() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  _calculateLatency() {
    return Math.floor(Math.random() * (this.latency.max - this.latency.min)) + this.latency.min;
  }
}

module.exports = SimulatedInternet;