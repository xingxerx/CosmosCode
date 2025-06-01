/**
 * Rate Limiter Middleware
 * Protects API endpoints from abuse
 */

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute default
    this.maxRequests = options.maxRequests || 100; // 100 requests per window default
    this.message = options.message || 'Too many requests, please try again later.';
    this.clients = new Map();
  }

  middleware() {
    return (req, res, next) => {
      // Get client identifier (IP address or API key)
      const clientId = req.headers['x-api-key'] || req.ip;
      
      // Get current timestamp
      const now = Date.now();
      
      // Initialize or get client's request record
      if (!this.clients.has(clientId)) {
        this.clients.set(clientId, {
          requests: [],
          blocked: false,
          blockedUntil: 0
        });
      }
      
      const client = this.clients.get(clientId);
      
      // Check if client is blocked
      if (client.blocked && now < client.blockedUntil) {
        return res.status(429).json({
          error: this.message,
          retryAfter: Math.ceil((client.blockedUntil - now) / 1000)
        });
      }
      
      // Reset block if it has expired
      if (client.blocked && now >= client.blockedUntil) {
        client.blocked = false;
      }
      
      // Filter requests within the current time window
      client.requests = client.requests.filter(timestamp => 
        now - timestamp < this.windowMs
      );
      
      // Check if client has exceeded rate limit
      if (client.requests.length >= this.maxRequests) {
        client.blocked = true;
        client.blockedUntil = now + this.windowMs;
        
        return res.status(429).json({
          error: this.message,
          retryAfter: Math.ceil(this.windowMs / 1000)
        });
      }
      
      // Add current request timestamp
      client.requests.push(now);
      
      // Continue to the next middleware
      next();
    };
  }
}

module.exports = RateLimiter;