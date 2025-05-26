const mongoose = require('mongoose');

const SimulationResultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  results: {
    type: Buffer,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

// Add methods for data export/import
SimulationResultSchema.methods.exportCSV = function() {
  // Implementation
};

module.exports = mongoose.model('SimulationResult', SimulationResultSchema);