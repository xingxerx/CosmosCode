const fs = require('fs');
const path = require('path');

class NetworkPersistence {
  constructor(dataDir = path.join(__dirname, '../../data')) {
    this.dataDir = dataDir;
    this.networkFile = path.join(this.dataDir, 'network-state.json');
    
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }
  
  saveNetwork(internet, dns) {
    try {
      // Convert nodes Map to array of objects
      const nodes = Array.from(internet.nodes.entries()).map(([id, node]) => ({
        id,
        type: node.type,
        ip: node.ip,
        status: node.status,
        connections: [...node.connections]
      }));
      
      // Convert connections Map to array of objects
      const connections = Array.from(internet.connections.entries()).map(([id, conn]) => ({
        id,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        latency: conn.latency,
        packetLoss: conn.packetLoss
      }));
      
      // Convert domains Map to array of objects
      const domains = Array.from(dns.domains.entries()).map(([domain, info]) => ({
        domain,
        nodeId: info.nodeId,
        ip: info.ip
      }));
      
      const networkState = {
        running: internet.running,
        nodes,
        connections,
        domains,
        stats: {
          messagesDelivered: internet.stats.messagesDelivered,
          messagesLost: internet.stats.messagesLost,
          totalLatency: internet.stats.totalLatency
        }
      };
      
      fs.writeFileSync(this.networkFile, JSON.stringify(networkState, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving network state:', error);
      return false;
    }
  }
  
  loadNetwork(internet, dns) {
    try {
      if (!fs.existsSync(this.networkFile)) {
        return false;
      }
      
      const data = fs.readFileSync(this.networkFile, 'utf8');
      const networkState = JSON.parse(data);
      
      // Clear existing state
      internet.nodes.clear();
      internet.connections.clear();
      dns.domains.clear();
      
      // Restore nodes
      for (const node of networkState.nodes) {
        internet.nodes.set(node.id, {
          type: node.type,
          ip: node.ip,
          status: node.status,
          connections: new Set(node.connections)
        });
      }
      
      // Restore connections
      for (const conn of networkState.connections) {
        internet.connections.set(conn.id, {
          sourceId: conn.sourceId,
          targetId: conn.targetId,
          latency: conn.latency,
          packetLoss: conn.packetLoss
        });
      }
      
      // Restore domains
      for (const domain of networkState.domains) {
        dns.domains.set(domain.domain, {
          nodeId: domain.nodeId,
          ip: domain.ip
        });
      }
      
      // Restore stats
      internet.stats.messagesDelivered = networkState.stats.messagesDelivered;
      internet.stats.messagesLost = networkState.stats.messagesLost;
      internet.stats.totalLatency = networkState.stats.totalLatency;
      
      // Restore running state
      internet.running = networkState.running;
      
      return true;
    } catch (error) {
      console.error('Error loading network state:', error);
      return false;
    }
  }
}

module.exports = NetworkPersistence;