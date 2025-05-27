/**
 * Simple in-memory data store with file persistence
 */
const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File paths for different data types
const simulationsFile = path.join(dataDir, 'simulations.json');
const visualizationsFile = path.join(dataDir, 'visualizations.json');

// Initialize data stores
let simulations = [];
let visualizations = [];

// Load data from files if they exist
try {
  if (fs.existsSync(simulationsFile)) {
    simulations = JSON.parse(fs.readFileSync(simulationsFile, 'utf8'));
    console.log(`Loaded ${simulations.length} simulations from file`);
  }
} catch (error) {
  console.error('Error loading simulations:', error);
}

try {
  if (fs.existsSync(visualizationsFile)) {
    visualizations = JSON.parse(fs.readFileSync(visualizationsFile, 'utf8'));
    console.log(`Loaded ${visualizations.length} visualizations from file`);
  }
} catch (error) {
  console.error('Error loading visualizations:', error);
}

// Save data to files
function saveSimulations() {
  try {
    fs.writeFileSync(simulationsFile, JSON.stringify(simulations, null, 2));
  } catch (error) {
    console.error('Error saving simulations:', error);
  }
}

function saveVisualizations() {
  try {
    fs.writeFileSync(visualizationsFile, JSON.stringify(visualizations, null, 2));
  } catch (error) {
    console.error('Error saving visualizations:', error);
  }
}

// Simulation methods
function addSimulation(simulation) {
  simulations.push(simulation);
  saveSimulations();
  return simulation;
}

function getSimulations() {
  return simulations;
}

function getSimulationById(id) {
  return simulations.find(sim => sim.id === id);
}

// Visualization methods
function addVisualization(visualization) {
  visualizations.push(visualization);
  saveVisualizations();
  return visualization;
}

function getVisualizations() {
  return visualizations;
}

function getVisualizationById(id) {
  return visualizations.find(viz => viz.id === id);
}

module.exports = {
  addSimulation,
  getSimulations,
  getSimulationById,
  addVisualization,
  getVisualizations,
  getVisualizationById
};