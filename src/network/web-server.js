/**
 * Web Server for Simulated Internet
 */

class WebServer {
  constructor(nodeId, options = {}) {
    this.nodeId = nodeId;
    this.routes = new Map();
    this.staticFiles = new Map();
    this.middleware = [];
    this.port = options.port || 80;
    this.running = false;
  }

  // Add a route handler
  addRoute(path, method, handler) {
    const routeKey = `${method.toUpperCase()}:${path}`;
    this.routes.set(routeKey, handler);
    return this;
  }

  // Add static file
  addStaticFile(path, content, contentType = 'text/html') {
    this.staticFiles.set(path, { content, contentType });
    return this;
  }

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  // Start the server
  start() {
    this.running = true;
    return this;
  }

  // Stop the server
  stop() {
    this.running = false;
    return this;
  }

  // Handle a request
  handleRequest(request) {
    if (!this.running) {
      return {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server is not running' })
      };
    }

    // Run middleware
    for (const middleware of this.middleware) {
      const result = middleware(request);
      if (result) {
        return result;
      }
    }

    // Check for static files
    if (request.method === 'GET' && this.staticFiles.has(request.path)) {
      const file = this.staticFiles.get(request.path);
      return {
        status: 200,
        headers: { 'Content-Type': file.contentType },
        body: file.content
      };
    }

    // Check for route handlers
    const routeKey = `${request.method}:${request.path}`;
    const handler = this.routes.get(routeKey);
    
    if (handler) {
      try {
        const result = handler(request);
        return {
          status: result.status || 200,
          headers: result.headers || { 'Content-Type': 'application/json' },
          body: result.body || JSON.stringify(result)
        };
      } catch (error) {
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: error.message })
        };
      }
    }

    // Not found
    return {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' })
    };
  }
}

module.exports = WebServer;