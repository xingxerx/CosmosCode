const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class NetworkSimulationProcess {
  constructor() {
    this.executablePath = path.join(__dirname, 'network_sim');
    this.inputFile = path.join(__dirname, 'network_input.json');
    this.outputFile = path.join(__dirname, 'network_output.json');
    
    // Ensure the C++ program is compiled
    this.ensureCompiled();
  }
  
  ensureCompiled() {
    // Check if executable exists, if not compile it
    if (!fs.existsSync(this.executablePath)) {
      console.log('Compiling network simulation executable...');
      const compile = spawn('g++', [
        path.join(__dirname, 'network_sim.cpp'),
        '-o', this.executablePath
      ]);
      
      compile.stdout.on('data', (data) => {
        console.log(`Compiler output: ${data}`);
      });
      
      compile.stderr.on('data', (data) => {
        console.error(`Compiler error: ${data}`);
      });
      
      compile.on('close', (code) => {
        if (code !== 0) {
          console.error(`Compilation failed with code ${code}`);
        } else {
          console.log('Compilation successful');
        }
      });
    }
  }
  
  async runSimulation(config) {
    return new Promise((resolve, reject) => {
      // Write configuration to input file
      fs.writeFileSync(this.inputFile, JSON.stringify(config));
      
      // Run the C++ program
      const process = spawn(this.executablePath, [this.inputFile, this.outputFile]);
      
      let stdoutData = '';
      let stderrData = '';
      
      process.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Process exited with code ${code}: ${stderrData}`));
        } else {
          try {
            // Read results from output file
            const results = JSON.parse(fs.readFileSync(this.outputFile, 'utf8'));
            resolve({
              results,
              stdout: stdoutData
            });
          } catch (error) {
            reject(new Error(`Failed to parse output: ${error.message}`));
          }
        }
      });
      
      process.on('error', (error) => {
        reject(new Error(`Failed to start process: ${error.message}`));
      });
    });
  }
}

module.exports = NetworkSimulationProcess;