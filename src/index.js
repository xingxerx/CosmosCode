// Main application entry point
const cosmologyService = require('./services/cosmology');
const medicalService = require('./services/medical');

// Initialize services
cosmologyService.init();
medicalService.init();

// Start the application
console.log('CosmosCode application started');