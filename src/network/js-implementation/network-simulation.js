/**
 * JavaScript implementation of the network simulation
 */
class NetworkNode {
  constructor(id, type, ip) {
    this.id = id;
    this.type = type;
    this.ip = ip;
    this.active = false;
    this.connections = [];
    this.properties = this._initializeProperties(type);
  }
  
  _initializeProperties(type) {
    // Set default properties based on node type
    switch(type) {
      case 'firewall':
        return {
          packetInspection: true,
          blockUnauthorized: true,
          throughput: 1000 // Mbps
        };
      case 'loadbalancer':
        return {
          algorithm: 'round-robin',
          maxConnections: 1000,
          healthCheck: true
        };
      case 'router':
        return {
          forwardingTable: {},
          maxRoutes: 1000,
          bandwidth: 2000 // Mbps
        };
      case 'server':
      case 'client':
      default:
        return {
          bandwidth: 100 // Mbps
        };
    }
  }
  
  activate() {
    this.active = true;
  }
  
  deactivate() {
    this.active = false;
  }
  
  sendData(target, data) {
    if (!this.active) {
      return false;
    }
    if (!target.active) {
      return false;
    }
    return true;
  }
  
  // Add connection to another node
  connect(targetNode) {
    if (!this.connections.includes(targetNode.id)) {
      this.connections.push(targetNode.id);
      return true;
    }
    return false;
  }
}

class NetworkSimulation {
  constructor() {
    this.nodes = [];
  }
  
  addNode(id, type, ip) {
    const node = new NetworkNode(id, type, ip);
    this.nodes.push(node);
    return this.nodes.length - 1;
  }
  
  activateNode(index) {
    if (index >= 0 && index < this.nodes.length) {
      this.nodes[index].activate();
      return true;
    }
    return false;
  }
  
  deactivateNode(index) {
    if (index >= 0 && index < this.nodes.length) {
      this.nodes[index].deactivate();
      return true;
    }
    return false;
  }
  
  sendData(sourceIndex, targetIndex, data) {
    if (sourceIndex >= 0 && sourceIndex < this.nodes.length && 
        targetIndex >= 0 && targetIndex < this.nodes.length) {
      return this.nodes[sourceIndex].sendData(this.nodes[targetIndex], data);
    }
    return false;
  }
  
  getNodeInfo(index) {
    if (index >= 0 && index < this.nodes.length) {
      return this.nodes[index];
    }
    return null;
  }
}

module.exports = NetworkSimulation;
