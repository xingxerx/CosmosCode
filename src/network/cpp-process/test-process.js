const NetworkSimulationProcess = require('./network-process');

async function runTest() {
  const simulation = new NetworkSimulationProcess();
  
  // Define network configuration
  const config = {
    nodes: [
      { id: "server-1", type: "server", ip: "192.168.1.1" },
      { id: "router-1", type: "router", ip: "192.168.1.254" },
      { id: "client-1", type: "client", ip: "192.168.1.100" },
      { id: "client-2", type: "client", ip: "192.168.1.101" }
    ],
    actions: [
      { type: "activate", nodeIndex: 0 },  // Activate server
      { type: "activate", nodeIndex: 1 },  // Activate router
      { type: "activate", nodeIndex: 2 },  // Activate client-1
      { type: "activate", nodeIndex: 3 },  // Activate client-2
      { type: "sendData", sourceIndex: 2, targetIndex: 0, data: "GET /api/data" },
      { type: "sendData", sourceIndex: 0, targetIndex: 2, data: "200 OK: {\"data\": [1, 2, 3]}" },
      { type: "deactivate", nodeIndex: 0 },  // Deactivate server
      { type: "sendData", sourceIndex: 2, targetIndex: 0, data: "GET /api/status" }
    ]
  };
  
  try {
    console.log("Running network simulation...");
    const result = await simulation.runSimulation(config);
    
    console.log("\nSimulation output:");
    console.log(result.stdout);
    
    console.log("\nSimulation results:");
    console.log(JSON.stringify(result.results, null, 2));
  } catch (error) {
    console.error("Simulation failed:", error.message);
  }
}

runTest();
