const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '5', 10)
  },
  simulation: {
    maxWorkers: parseInt(process.env.MAX_WORKERS || '4', 10),
    precision: process.env.SIMULATION_PRECISION || 'standard'
  }
};

module.exports = config;