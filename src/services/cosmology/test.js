// Simple test file for simulationEngine.js
const { runCosmologicalSimulation } = require('./simulationEngine');

// Mock the Python bridge to avoid the ENOENT error
const pythonBridge = require('../pythonBridge');
const originalRunPythonScript = pythonBridge.runPythonScript;

// Replace with a mock function for testing
pythonBridge.runPythonScript = function() {
  console.log('Using mock Python bridge');
  return Promise.resolve(JSON.stringify({
    particles: 1000,
    energy: 0.5,
    clusters: 3,
    momentum: 0.1
  }));
};

async function testSimulation() {
  try {
    console.log('Running test simulation...');
    
    const parameters = {
      type: 'nbody',
      particles: 1000,
      iterations: 100
    };
    
    const result = await runCosmologicalSimulation(parameters);
    console.log('Simulation result:', JSON.stringify(result, null, 2));
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Restore the original function
    pythonBridge.runPythonScript = originalRunPythonScript;
  }
}

testSimulation();
