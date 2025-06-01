/**
 * Network API Routes
 */
const express = require('express');
const router = express.Router();

// Network monitor and simulation instances will be injected
module.exports = function(networkMonitor, simulatedInternet, dnsService) {
  // Get network status
  router.get('/status', (req, res) => {
    res.json(networkMonitor.getNetworkStats());
  });

  // Get all nodes
  router.get('/nodes', (req, res) => {
    const nodes = Array.from(simulatedInternet.nodes.values()).map(node => ({
      id: node.id,
      type: node.type,
      ip: node.ip,
      status: node.status
    }));
    res.json(nodes);
  });

  // Get all connections
  router.get('/connections', (req, res) => {
    const connections = Array.from(simulatedInternet.connections.values()).map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      latency: conn.latency,
      bandwidth: conn.bandwidth,
      status: conn.status
    }));
    res.json(connections);
  });

  // Get DNS records
  router.get('/dns', (req, res) => {
    res.json(dnsService.listDomains());
  });

  // Add a new node
  router.post('/nodes', (req, res) => {
    try {
      const { type, id } = req.body;
      const nodeId = id || `${type}-${Date.now().toString(36)}`;
      const node = simulatedInternet.createNode(nodeId, type);
      res.status(201).json(node);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a node
  router.delete('/nodes/:id', (req, res) => {
    try {
      const { id } = req.params;
      simulatedInternet.removeNode(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Start a node
  router.post('/start-node/:id', (req, res) => {
    try {
      const { id } = req.params;
      const node = simulatedInternet.startNode(id);
      res.json