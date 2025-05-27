/**
 * DNS Service for Simulated Internet
 */

class DNSService {
  constructor() {
    this.domains = new Map();
    this.reverseLookup = new Map();
  }

  // Register a domain name
  registerDomain(domain, nodeId, ip) {
    if (this.domains.has(domain)) {
      throw new Error(`Domain ${domain} is already registered`);
    }
    
    this.domains.set(domain, { nodeId, ip });
    this.reverseLookup.set(ip, domain);
    return { domain, nodeId, ip };
  }

  // Resolve domain to IP
  resolve(domain) {
    const record = this.domains.get(domain);
    if (!record) {
      throw new Error(`Domain ${domain} not found`);
    }
    return record.ip;
  }

  // Reverse lookup IP to domain
  reverseDNS(ip) {
    const domain = this.reverseLookup.get(ip);
    if (!domain) {
      throw new Error(`No domain found for IP ${ip}`);
    }
    return domain;
  }

  // List all domains
  listDomains() {
    return Array.from(this.domains.keys());
  }

  // Remove a domain
  removeDomain(domain) {
    const record = this.domains.get(domain);
    if (record) {
      this.reverseLookup.delete(record.ip);
      this.domains.delete(domain);
      return true;
    }
    return false;
  }
}

module.exports = DNSService;