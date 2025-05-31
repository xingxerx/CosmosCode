/**
 * Server Startup Script
 * 
 * This script starts the CosmosCode server on port 3001
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const PORT = 3001;
const SERVER_PATH = path.join(__dirname, 'src', 'index.js');

// Set environment variables
process.env.PORT = PORT;
process.env.NODE_ENV = 'development';

console.log(`Starting server on port ${PORT}...`);
console.log(`Server path: ${SERVER_PATH}`);

// Start the server
const server = spawn('node', [SERVER_PATH], {
  env: process.env,
  stdio: 'inherit' // This will pipe the child process's stdout/stderr to the parent
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

console.log('Server process started. Press Ctrl+C to stop.');