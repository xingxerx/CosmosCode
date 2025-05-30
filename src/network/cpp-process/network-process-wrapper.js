const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

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
  }
  
  ensureCompiled() {
    // Check if executable exists, if not compile it
    if (!fs.existsSync(this.executablePath)) {
      console.log('Compiling network simulation executable...');
      try {
        // Use direct g++ command instead of make
        execSync(`g++ -std=c++17 -o ${this.executablePath} ${path.join(__dirname, 'network_process.cpp')}`);
        console.log('Compilation successful');
      } catch (error) {
        console.error('Compilation failed:', error.message);
      }
    }
  }
  
  async sendCommand(commandStr) {
    return new Promise((resolve, reject) => {
      let responseData = '';
      
      const responseHandler = (data) => {
        responseData += data.toString().trim();
        
        // Check if we have a complete JSON object
        if (responseData.startsWith('{') && responseData.endsWith('}')) {
          try {
            const response = JSON.parse(responseData);
            this.process.stdout.removeListener('data', responseHandler);
            resolve(response);
          } catch (error) {
            this.process.stdout.removeListener('data', responseHandler);
            reject(new Error(`Failed to parse response: ${error.message}, Response: ${responseData}`));
          }
        }
      };
      
      this.process.stdout.on('data', responseHandler);
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
    
    // If we have a result property, it's the old format (empty object)
    if (response.hasOwnProperty('result')) {
      return response.result;
    }
    
    // Otherwise, we have the node properties directly
    return {
      id: response.id,
      type: response.type,
      ip: response.ip,
      active: response.active
    };
  }
  
  close() {
    this.process.stdin.write('exit\n');
    this.process.stdin.end();
  }
}

module.exports = { NetworkProcessSimulation };
