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
  }

  activate() {
    this.active = true;
    console.log(`Node ${this.id} (${this.ip}) activated`);
    return true;
  }

  deactivate() {
    this.active = false;
    console.log(`Node ${this.id} (${this.ip}) deactivated`);
    return true;
  }

  sendData(target, data) {
    if (!this.active) {
      console.log(`Error: Source node ${this.id} is not active`);
      return false;
    }
    if (!target.active) {
      console.log(`Error: Target node ${target.id} is not active`);
      return false;
    }
    console.log(`Data sent from ${this.id} to ${target.id}: ${data}`);
    return true;
  }

  connect(targetNode) {
    if (!this.connections.includes(targetNode.id)) {
      this.connections.push(targetNode.id);
      console.log(`Connection established from ${this.id} to ${targetNode.id}`);
      return true;
    }
    return false;
  }

  disconnect(targetNode) {
    const index = this.connections.indexOf(targetNode.id);
    if (index !== -1) {
      this.connections.splice(index, 1);
      console.log(`Connection removed from ${this.id} to ${targetNode.id}`);
      return true;
    }
    return false;
  }
}

class NetworkSimulation {
  constructor() {
    this.nodes = [];
    this.nodeMap = new Map();
  }

  addNode(id, type, ip) {
    const node = new NetworkNode(id, type, ip);
    this.nodes.push(node);
    this.nodeMap.set(id, node);
    return this.nodes.length - 1;
  }

  getNode(index) {
    return this.nodes[index];
  }

  getNodeById(id) {
    return this.nodeMap.get(id);
  }

  activateNode(index) {
    if (index >= 0 && index < this.nodes.length) {
      return this.nodes[index].activate();
    }
    return false;
  }

  deactivateNode(index) {
    if (index >= 0 && index < this.nodes.length) {
      return this.nodes[index].deactivate();
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

  connectNodes(sourceIndex, targetIndex) {
    if (sourceIndex >= 0 && sourceIndex < this.nodes.length && 
        targetIndex >= 0 && targetIndex < this.nodes.length) {
      return this.nodes[sourceIndex].connect(this.nodes[targetIndex]);
    }
    return false;
  }

  disconnectNodes(sourceIndex, targetIndex) {
    if (sourceIndex >= 0 && sourceIndex < this.nodes.length && 
        targetIndex >= 0 && targetIndex < this.nodes.length) {
      return this.nodes[sourceIndex].disconnect(this.nodes[targetIndex]);
    }
    return false;
  }

  getNodeInfo(index) {
    if (index >= 0 && index < this.nodes.length) {
      const node = this.nodes[index];
      return {
        id: node.id,
        type: node.type,
        ip: node.ip,
        active: node.active,
        connections: node.connections
      };
    }
    return null;
  }

  getAllNodes() {
    return this.nodes.map((node, index) => this.getNodeInfo(index));
  }
}

module.exports = NetworkSimulation;