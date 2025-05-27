/**
 * Logger utility
 */
const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${message}`);
    }
  },
  
  error: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${message}`);
    }
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV !== 'test' && process.env.DEBUG) {
      console.log(`[DEBUG] ${message}`);
    }
  },
  
  warn: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${message}`);
    }
  }
};

module.exports = logger;
