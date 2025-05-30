/**
 * JavaScript implementation of the network simulation
 */
class NetworkNode {
  constructor(id, type, ip) {
    this.id = id;
    this.type = type;
    this.ip = ip;
    this.active = false;
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
