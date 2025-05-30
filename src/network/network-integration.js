/**
 * Network Integration Module
 * 
 * This module provides a unified interface to the different network simulation implementations:
 * 1. Native C++ addon using N-API
 * 2. C++ process execution
 * 3. Pure JavaScript implementation
 */

const path = require('path');
const config = require('../config');

// Import implementations
let cppAddon = null;
try {
  cppAddon = require('./cpp-addon');
} catch (error) {
  console.warn('C++ addon not available:', error.message);
}

const NetworkSimulationProcess = require('./cpp-process/network-process');
const JSNetworkSimulation = require('./js-implementation/network-simulation');

class NetworkIntegration {
  constructor(options = {}) {
    this.options = {
      preferNative: true,
      fallbackToProcess: true,
      ...options
    };
    
    this.implementation = null;
    this.implementationType = null;
    
    // Initialize the best available implementation
    this._initializeImplementation();
  }
  
  _initializeImplementation() {
    // Try to use C++ addon if preferred and available
    if (this.options.preferNative && cppAddon) {
      try {
        this.implementation = new cppAddon.NetworkSimulation();
        this.implementationType = 'native';
        console.log('Using native C++ addon for network simulation');
        return;
      } catch (error) {
        console.warn('Failed to initialize C++ addon:', error.message);
      }
    }
    
    // Fall back to process-based implementation if allowed
    if (this.options.fallbackToProcess) {
      try {
        this.implementation = new NetworkSimulationProcess();
        this.implementationType = 'process';
        console.log('Using C++ process for network simulation');
        return;
      } catch (error) {
        console.warn('Failed to initialize C++ process:', error.message);
      }
    }
    
    // Always fall back to JavaScript implementation
    this.implementation = new JSNetworkSimulation();
    this.implementationType = 'javascript';
    console.log('Using JavaScript implementation for network simulation');
  }
  
  async createSimulation(nodes) {
    if (this.implementationType === 'process') {
      // For process-based implementation, we need to prepare a config
      const config = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          ip: node.ip
        })),
        actions: []
      };
      
      // Store the config for later use
      this.processConfig = config;
      return true;
    } else {
      // For native and JS implementations, add nodes directly
      this.nodeIndices = {};
      
      for (const node of nodes) {
        const index = this.implementation.addNode(node.id, node.type, node.ip);
        this.nodeIndices[node.id] = index;
      }
      
      return true;
    }
  }
  
  async activateNode(nodeId) {
    if (this.implementationType === 'process') {
      this.processConfig.actions.push({
        type: 'activate',
        nodeIndex: this._getNodeIndex(nodeId)
      });
      return true;
    } else {
      return this.implementation.activateNode(this._getNodeIndex(nodeId));
    }
  }
  
  async deactivateNode(nodeId) {
    if (this.implementationType === 'process') {
      this.processConfig.actions.push({
        type: 'deactivate',
        nodeIndex: this._getNodeIndex(nodeId)
      });
      return true;
    } else {
      return this.implementation.deactivateNode(this._getNodeIndex(nodeId));
    }
  }
  
  async sendData(sourceId, targetId, data) {
    if (this.implementationType === 'process') {
      this.processConfig.actions.push({
        type: 'sendData',
        sourceIndex: this._getNodeIndex(sourceId),
        targetIndex: this._getNodeIndex(targetId),
        data
      });
      return true;
    } else {
      return this.implementation.sendData(
        this._getNodeIndex(sourceId),
        this._getNodeIndex(targetId),
        data
      );
    }
  }
  
  async getNodeInfo(nodeId) {
    if (this.implementationType === 'process') {
      // For process implementation, we need to run the simulation first
      await this.runSimulation();
      
      // Find the node in the results
      const nodeIndex = this._getNodeIndex(nodeId);
      if (this.lastResults && this.lastResults.nodes && this.lastResults.nodes[nodeIndex]) {
        return this.lastResults.nodes[nodeIndex];
      }
      return null;
    } else {
      return this.implementation.getNodeInfo(this._getNodeIndex(nodeId));
    }
  }
  
  async runSimulation() {
    if (this.implementationType === 'process') {
      const result = await this.implementation.runSimulation(this.processConfig);
      this.lastResults = result.results;
      return result;
    }
    
    // For native and JS implementations, there's no explicit "run" step
    return { success: true };
  }
  
  _getNodeIndex(nodeId) {
    if (this.implementationType === 'process') {
      // For process implementation, find the index in the config
      return this.processConfig.nodes.findIndex(node => node.id === nodeId);
    } else {
      // For native and JS implementations, use the stored indices
      return this.nodeIndices[nodeId];
    }
  }
}

module.exports = NetworkIntegration;