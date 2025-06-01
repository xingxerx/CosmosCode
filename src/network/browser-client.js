/**
 * Browser Client for Simulated Internet
 */

class BrowserClient {
  constructor(nodeId, options = {}) {
    this.nodeId = nodeId;
    this.internet = options.internet;
    this.dnsService = options.dnsService;
    this.history = [];
    this.cookies = new Map();
    this.localStorage = new Map();
    this.currentPage = null;
  }

  // Navigate to a URL
  async navigate(url) {
    try {
      // Parse URL
      const { domain, path } = this._parseUrl(url);
      
      // Resolve domain to IP
      const ip = this.dnsService.resolve(domain);
      
      // Find the node for this IP
      const targetNodeId = Array.from(this.internet.nodes.values())
        .find(node => node.ip === ip)?.id;
      
      if (!targetNodeId) {
        throw new Error(`No server found for domain ${domain}`);
      }
      
      // Create request
      const request = {
        method: 'GET',
        path: path || '/',
        headers: {
          'Host': domain,
          'User-Agent': 'SimulatedBrowser/1.0',
          'Cookie': this._getCookieHeader(domain)
        },
        body: null
      };
      
      // Send request to server
      const messageId = this.internet.sendMessage(this.nodeId, targetNodeId, {
        type: 'http-request',
        request
      });
      
      if (!messageId) {
        throw new Error('Failed to send request');
      }
      
      // Wait for response
      const response = await this._waitForResponse(messageId);
      
      // Process response
      this._processResponse(domain, response);
      
      // Add to history
      this.history.push({ url, timestamp: Date.now() });
      this.currentPage = { url, content: response.body };
      
      return response;
    } catch (error) {
      return {
        status: 0,
        headers: {},
        body: `Error: ${error.message}`
      };
    }
  }

  // Submit a form
  async submitForm(url, formData, method = 'POST') {
    try {
      // Parse URL
      const { domain, path } = this._parseUrl(url);
      
      // Resolve domain to IP
      const ip = this.dnsService.resolve(domain);
      
      // Find the node for this IP
      const targetNodeId = Array.from(this.internet.nodes.values())
        .find(node => node.ip === ip)?.id;
      
      if (!targetNodeId) {
        throw new Error(`No server found for domain ${domain}`);
      }
      
      // Create request
      const request = {
        method: method,
        path: path || '/',
        headers: {
          'Host': domain,
          'User-Agent': 'SimulatedBrowser/1.0',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': this._getCookieHeader(domain)
        },
        body: this._encodeFormData(formData)
      };
      
      // Send request to server
      const messageId = this.internet.sendMessage(this.nodeId, targetNodeId, {
        type: 'http-request',
        request
      });
      
      if (!messageId) {
        throw new Error('Failed to send request');
      }
      
      // Wait for response
      const response = await this._waitForResponse(messageId);
      
      // Process response
      this._processResponse(domain, response);
      
      // Add to history
      this.history.push({ url, method, timestamp: Date.now() });
      this.currentPage = { url, content: response.body };
      
      return response;
    } catch (error) {
      return {
        status: 0,
        headers: {},
        body: `Error: ${error.message}`
      };
    }
  }

  // Helper methods
  _parseUrl(url) {
    // Simple URL parser
    const [domainPart, ...pathParts] = url.replace(/^https?:\/\//, '').split('/');
    return {
      domain: domainPart,
      path: pathParts.length > 0 ? `/${pathParts.join('/')}` : '/'
    };
  }

  _getCookieHeader(domain) {
    const cookies = [];
    this.cookies.forEach((value, key) => {
      if (key.endsWith(domain)) {
        cookies.push(`${key.split('.')[0]}=${value}`);
      }
    });
    return cookies.join('; ');
  }

  _encodeFormData(data) {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  _processResponse(domain, response) {
    // Process cookies
    const setCookie = response.headers['Set-Cookie'];
    if (setCookie) {
      setCookie.split(',').forEach(cookie => {
        const [nameValue] = cookie.trim().split(';');
        const [name, value] = nameValue.split('=');
        this.cookies.set(`${name}.${domain}`, value);
      });
    }
    
    return response;
  }

  _waitForResponse(messageId) {
    return new Promise((resolve) => {
      const handler = ({ packet }) => {
        if (packet.data.type === 'http-response' && 
            packet.data.requestId === messageId) {
          this.internet.removeListener('message-delivered', handler);
          resolve(packet.data.response);
        }
      };
      
      this.internet.on('message-delivered', handler);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        this.internet.removeListener('message-delivered', handler);
        resolve({
          status: 0,
          headers: {},
          body: 'Request timed out'
        });
      }, 5000);
    });
  }
}

module.exports = BrowserClient;