const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class NetworkProcessSimulation {
  constructor() {
    this.executablePath = path.join(__dirname, 'network_process');
    this.ensureCompiled();
    
    this.process = spawn(this.executablePath);
    
    this.process.stdout.setEncoding('utf8');
    this.process.stderr.setEncoding('utf8');
    
    this.process.stderr.on('data', (data) => {
      console.error(`Error from C++ process: ${data}`);
    });
    
    this.process.on('close', (code) => {
      console.log(`C++ process exited with code ${code}`);
    });
    
    this.responseQueue = [];
    this.waitingForResponse = false;
  }
  
  ensureCompiled() {
    // Check if executable exists, if not compile it
    if (!fs.existsSync(this.executablePath)) {
      console.log('Compiling network simulation executable...');
      const { execSync } = require('child_process');
      try {
        execSync(`g++ -std=c++17 -o ${this.executablePath} ${path.join(__dirname, 'network_process.cpp')}`);
        console.log('Compilation successful');
      } catch (error) {
        console.error('Compilation failed:', error.message);
      }
    }
  }
  
  async sendCommand(commandStr) {
    return new Promise((resolve, reject) => {
      this.process.stdout.once('data', (data) => {
        try {
          const response = JSON.parse(data.toString().trim());
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
      
      this.process.stdin.write(commandStr + '\n');
    });
  }
  
  async addNode(id, type, ip) {
    const response = await this.sendCommand(`addNode ${id} ${type} ${ip}`);
    return response.result;
  }
  
  async activateNode(index) {
    const response = await this.sendCommand(`activateNode ${index}`);
    return response.result;
  }
  
  async deactivateNode(index) {
    const response = await this.sendCommand(`deactivateNode ${index}`);
    return response.result;
  }
  
  async sendData(source, target, data) {
    const response = await this.sendCommand(`sendData ${source} ${target} ${data}`);
    return response.result;
  }
  
  async getNodeInfo(index) {
    const response = await this.sendCommand(`getNodeInfo ${index}`);
    try {
      // The result might be a JSON string inside a JSON object
      return JSON.parse(response.result);
    } catch (error) {
      return response.result;
    }
  }
  
  close() {
    this.process.stdin.write('exit\n');
    this.process.stdin.end();
  }
}

module.exports = { NetworkProcessSimulation };
