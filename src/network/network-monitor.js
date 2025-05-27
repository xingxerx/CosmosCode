/**
 * Network Monitor for Simulated Internet
 */

class NetworkMonitor {
  constructor(internet) {
    this.internet = internet;
    this.stats = {
      messagesSent: 0,
      messagesDelivered: 0,
      messagesLost: 0,
      bytesTransferred: 0,
      activeNodes: 0,
      totalLatency: 0
    };
    this.nodeStats = new Map();
    this.connectionStats = new Map();
    this.setupListeners();
  }

  setupListeners() {
    // Track messages sent
    this.internet.on('message-delivered', ({ packet }) => {
      this.stats.messagesDelivered++;
      this.stats.bytesTransferred += packet.size || 0;
      this.stats.totalLatency += Date.now() - packet.timestamp;
      
      // Update node stats
      this._updateNodeStat(packet.from, 'messagesSent', 1);
      this._updateNodeStat(packet.to, 'messagesReceived', 1);
      
      // Update connection stats
      const connectionId = `${packet.from}-${packet.to}`;
      this._updateConnectionStat(connectionId, 'messagesDelivered', 1);
      this._updateConnectionStat(connectionId, 'bytesTransferred', packet.size || 0);
    });
    
    // Track packet loss
    this.internet.on('packet-lost', ({ packet }) => {
      this.stats.messagesLost++;
      
      // Update connection stats
      const connectionId = `${packet.from}-${packet.to}`;
      this._updateConnectionStat(connectionId, 'messagesLost', 1);
    });
    
    // Track node status
    this.internet.on('node-online', ({ id }) => {
      this.stats.activeNodes++;
      this._updateNodeStat(id, 'status', 'online');
      this._updateNodeStat(id, 'lastStatusChange', Date.now());
    });
    
    this.internet.on('node-offline', ({ id }) => {
      this.stats.activeNodes--;
      this._updateNodeStat(id, 'status', 'offline');
      this._updateNodeStat(id, 'lastStatusChange', Date.now());
    });
  }

  getNetworkStats() {
    return {
      ...this.stats,
      averageLatency: this.stats.messagesDelivered > 0 ? 
                     this.stats.totalLatency / this.stats.messagesDelivered : 0,
      packetLossRate: (this.stats.messagesSent > 0) ? 
                     (this.stats.messagesLost / (this.stats.messagesDelivered + this.stats.messagesLost)) : 0,
      nodeCount: this.internet.nodes.size,
      connectionCount: this.internet.connections.size,
      timestamp: Date.now()
    };
  }

  getNodeStats(nodeId) {
    return this.nodeStats.get(nodeId) || { messagesSent: 0, messagesReceived: 0 };
  }

  getConnectionStats(connectionId) {
    return this.connectionStats.get(connectionId) || 
           { messagesDelivered: 0, messagesLost: 0, bytesTransferred: 0 };
  }

  generateReport() {
    const networkStats = this.getNetworkStats();
    const topNodes = Array.from(this.nodeStats.entries())
      .sort((a, b) => (b[1].messagesSent || 0) - (a[1].messagesSent || 0))
      .slice(0, 5);
    
    const topConnections = Array.from(this.connectionStats.entries())
      .sort((a, b) => (b[1].bytesTransferred || 0) - (a[1].bytesTransferred || 0))
      .slice(0, 5);
    
    return {
      timestamp: new Date().toISOString(),
      networkStats,
      topNodes,
      topConnections
    };
  }

  // Helper methods
  _updateNodeStat(nodeId, stat, value) {
    if (!this.nodeStats.has(nodeId)) {
      this.nodeStats.set(nodeId, {});
    }
    
    const stats = this.nodeStats.get(nodeId);
    if (typeof value === 'number') {
      stats[stat] = (stats[stat] || 0) + value;
    } else {
      stats[stat] = value;
    }
  }

  _updateConnectionStat(connectionId, stat, value) {
    if (!this.connectionStats.has(connectionId)) {
      this.connectionStats.set(connectionId, {});
    }
    
    const stats = this.connectionStats.get(connectionId);
    stats[stat] = (stats[stat] || 0) + value;
  }
}

module.exports = NetworkMonitor;