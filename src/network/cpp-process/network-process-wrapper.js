const { spawn } = require('child_process');
const path = require('path');

class NetworkProcessSimulation {
  constructor() {
    const executablePath = path.join(__dirname, 'network_process');
    this.process = spawn(executablePath);
    
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
    
    this.process.stdout.on('data', (data) => {
      const responses = data.trim().split('\n');
      for (const response of responses) {
        if (response) {
          this.responseQueue.push(JSON.parse(response));
          if (this.waitingForResponse) {
            this.resolveResponse();
          }
        }
      }
    });
  }
  
  async sendCommand(command) {
    return new Promise((resolve, reject) => {
      this.process.stdin.write(JSON.stringify(command) + '\n');
      
      const responseHandler = () => {
        this.waitingForResponse = true;
        this.currentResolve = resolve;
      };
      
      if (this.responseQueue.length > 0) {
        resolve(this.responseQueue.shift());
      } else {
        responseHandler();
      }
    });
  }
  
  resolveResponse() {
    if (this.responseQueue.length > 0 && this.currentResolve) {
      const resolve = this.currentResolve;
      const response = this.responseQueue.shift();
      
      this.waitingForResponse = false;
      this.currentResolve = null;
      
      resolve(response);
    }
  }
  
  async addNode(id, type, ip) {
    const response = await this.sendCommand({
      command: 'addNode',
      id,
      type,
      ip
    });
    return response.result;
  }
  
  async activateNode(index) {
    const response = await this.sendCommand({
      command: 'activateNode',
      index
    });
    return response.result;
  }
  
  async deactivateNode(index) {
    const response = await this.sendCommand({
      command: 'deactivateNode',
      index
    });
    return response.result;
  }
  
  async sendData(source, target, data) {
    const response = await this.sendCommand({
      command: 'sendData',
      source,
      target,
      data
    });
    return response.result;
  }
  
  async getNodeInfo(index) {
    const response = await this.sendCommand({
      command: 'getNodeInfo',
      index
    });
    return response.result;
  }
  
  close() {
    this.process.stdin.write(JSON.stringify({ command: 'exit' }) + '\n');
    this.process.stdin.end();
  }
}

module.exports = { NetworkProcessSimulation };