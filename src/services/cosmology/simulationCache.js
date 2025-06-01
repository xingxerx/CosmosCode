/**
 * Simulation Cache Service
 * Provides caching for simulation results to improve performance
 */

const crypto = require('crypto');

class SimulationCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 3600000; // Default TTL: 1 hour
    this.maxSize = options.maxSize || 100; // Maximum cache entries
  }

  /**
   * Generate a cache key from simulation parameters
   */
  generateKey(params) {
    const normalized = JSON.stringify(params, Object.keys(params).sort());
    return crypto.createHash('md5').update(normalized).digest('hex');
  }

  /**
   * Get a cached simulation result
   */
  get(params) {
    const key = this.generateKey(params);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if cache entry has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Store a simulation result in cache
   */
  set(params, result) {
    // Manage cache size
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    const key = this.generateKey(params);
    this.cache.set(key, {
      data: result,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.ttl
    });
    
    return key;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}

module.exports = new SimulationCache();