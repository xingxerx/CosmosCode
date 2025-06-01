const tf = require('@tensorflow/tfjs-node');
const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const logger = require('../../utils/logger');

/**
 * Loads a pre-trained model for cosmological predictions
 * @param {string} modelPath - Path to the saved model
 * @returns {Promise<tf.LayersModel>} - Loaded TensorFlow.js model
 */
async function loadModel(modelPath) {
  try {
    return await tf.loadLayersModel(`file://${modelPath}`);
  } catch (error) {
    logger.error(`Failed to load model: ${error.message}`);
    throw new Error('Model loading failed');
  }
}

/**
 * Makes predictions using the cosmological model
 * @param {Object} inputData - Input parameters for prediction
 * @param {tf.LayersModel} model - Loaded model
 * @returns {Promise<Object>} - Prediction results
 */
async function makePrediction(inputData, model) {
  // Convert input data to tensor
  const inputTensor = tf.tensor2d([Object.values(inputData)]);
  
  // Run prediction
  const prediction = model.predict(inputTensor);
  
  // Convert to JavaScript array
  const results = await prediction.array();
  
  // Clean up tensors
  inputTensor.dispose();
  prediction.dispose();
  
  return {
    input: inputData,
    prediction: results[0],
    timestamp: new Date()
  };
}

/**
 * Trains a new model using simulation data
 * @param {Array} trainingData - Array of simulation results
 * @returns {Promise<string>} - Path to the saved model
 */
async function trainModel(trainingData) {
  // For complex training, delegate to Python
  const inputFile = path.join(os.tmpdir(), `training_data_${Date.now()}.json`);
  await fs.writeFile(inputFile, JSON.stringify(trainingData));
  
  const scriptPath = path.join(__dirname, '../../../python/train_model.py');
  const modelPath = await runPythonScript(scriptPath, [inputFile]);
  
  return modelPath.trim();
}

module.exports = {
  loadModel,
  makePrediction,
  trainModel
};
