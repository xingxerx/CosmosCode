const NetworkSimulationProcess = require('./network-process');

async function runTest() {
  const simulation = new NetworkSimulationProcess();
  
  // Define network configuration
  const config = {
    nodes: [
      { id: "server-1", type: "server", ip: "192.168.1.1" },
      { id: "router-1", type: "router", ip: "192.168.1.254" },
      { id: "client-1", type: "client", ip: "192.168.1.100" },
      { id: "client-2", type: "client", ip: "192.168.1.1