import React, { useState, useEffect } from 'react';
import { LineChart, ParameterControls, ResultsTable } from './components';
import { fetchSimulationResults, runNewSimulation } from '../api';

const SimulationDashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [parameters, setParameters] = useState({
    initialConditions: {},
    runTime: 1000,
    precision: 'standard'
  });

  useEffect(() => {
    // Load simulations
    fetchSimulationResults().then(setSimulations);
  }, []);

  const handleRunSimulation = async () => {
    const result = await runNewSimulation(parameters);
    setSimulations([...simulations, result]);
    setSelectedSimulation(result);
  };

  return (
    <div className="dashboard">
      <h1>Cosmology Simulation Dashboard</h1>
      <ParameterControls 
        parameters={parameters} 
        onChange={setParameters} 
      />
      <button onClick={handleRunSimulation}>Run Simulation</button>
      {selectedSimulation && (
        <>
          <LineChart data={selectedSimulation.results} />
          <ResultsTable data={selectedSimulation.results} />
        </>
      )}
    </div>
  );
};

export default SimulationDashboard;