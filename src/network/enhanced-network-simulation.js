const NetworkSimulation = require('./js-implementation/network-simulation');
const SimulatedInternet = require('./simulated-internet');

class EnhancedNetworkSimulation {
  constructor(options = {}) {
    this.jsSimulation = new NetworkSimulation();
    this.simulatedInternet = new SimulatedInternet(options);
    this.nodeMapping = {}; // Maps node IDs to indices in jsSimulation
  }
  
  addNode(id, type, ip) {
    // Add to both implementations
    const nodeIndex = this.jsSimulation.addNode(id, type, ip);
    const node = this.simulatedInternet.createNode(id, type);
    
    // Store mapping
    this.nodeMapping[id] = nodeIndex;
    
    return id;
  }
  
  activateNode(id) {
    const nodeIndex = this.nodeMapping[id];
    this.jsSimulation.activateNode(nodeIndex);
    this.simulatedInternet.startNode(id);
    return true;
  }
  
  deactivateNode(id) {
    const nodeIndex = this.nodeMapping[id];
    this.jsSimulation.deactivateNode(nodeIndex);
    this.simulatedInternet.stopNode(id);
    return true;
  }
  
  connectNodes(sourceId, targetId) {
    // Connect in SimulatedInternet (which has more advanced connection features)
    this.simulatedInternet.connect(sourceId, targetId);
    return true;
  }
  
  sendData(sourceId, targetId, data) {
    // Use SimulatedInternet for actual message sending (with packet loss, latency)
    try {
      const messageId = this.simulatedInternet.sendMessage(sourceId, targetId, data);
      return { success: true, messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  sendRoutedData(sourceId, targetId, data) {
    // Use SimulatedInternet's routing capabilities
    try {
      const messageId = this.simulatedInternet.sendRoutedMessage(sourceId, targetId, data);
      return { success: true, messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  processMessages() {
    return this.simulatedInternet.processMessages();
  }
  
  getNetworkStats() {
    return this.simulatedInternet.stats;
  }
}

module.exports = EnhancedNetworkSimulation;