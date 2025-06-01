const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const os = require('os');

/**
 * Trains a deep learning model on combined cosmology and medical data
 * @param {Object} trainingData - Combined training data
 * @param {Object} modelConfig - Model configuration
 * @returns {Promise<Object>} - Trained model information
 */
async function trainCrossDisciplinaryModel(trainingData, modelConfig = {}) {
  logger.info('Training cross-disciplinary deep learning model');
  
  try {
    const {
      architecture = 'transformer',
      epochs = 100,
      batchSize = 32,
      learningRate = 0.001,
      validationSplit = 0.2,
      earlyStopping = true,
      regularization = 'l2'
    } = modelConfig;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `training_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(trainingData));
    
    // Create config file
    const configFile = path.join(os.tmpdir(), `model_config_${Date.now()}.json`);
    await fs.writeFile(configFile, JSON.stringify({
      architecture,
      epochs,
      batch_size: batchSize,
      learning_rate: learningRate,
      validation_split: validationSplit,
      early_stopping: earlyStopping,
      regularization
    }));
    
    // Output directory for model
    const modelDir = path.join(os.tmpdir(), `model_${Date.now()}`);
    await fs.mkdir(modelDir, { recursive: true });
    
    // Run training script
    const scriptPath = path.join(__dirname, '../../../python/train_cross_model.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--config', configFile,
      '--output', modelDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      modelPath: path.join(modelDir, results.model_filename),
      trainingHistory: results.training_history,
      validationMetrics: results.validation_metrics,
      modelSummary: results.model_summary,
      featureImportance: results.feature_importance,
      hyperparameters: results.hyperparameters
    };
  } catch (error) {
    logger.error(`Model training failed: ${error.message}`);
    throw new Error('Cross-disciplinary model training failed');
  }
}

/**
 * Makes predictions using a trained deep learning model
 * @param {string} modelPath - Path to the trained model
 * @param {Object} inputData - Input data for prediction
 * @returns {Promise<Object>} - Prediction results
 */
async function predictWithModel(modelPath, inputData) {
  logger.info('Making predictions with deep learning model');
  
  try {
    // Create input file
    const inputFile = path.join(os.tmpdir(), `prediction_input_${Date.now()}.json`);
    await fs.writeFile(inputFile, JSON.stringify(inputData));
    
    // Run prediction script
    const scriptPath = path.join(__dirname, '../../../python/predict_with_model.py');
    const output = await runPythonScript(scriptPath, [
      '--model', modelPath,
      '--input', inputFile
    ]);
    
    // Parse results
    return JSON.parse(output);
  } catch (error) {
    logger.error(`Prediction failed: ${error.message}`);
    throw new Error('Model prediction failed');
  }
}

/**
 * Performs feature extraction on complex datasets
 * @param {Object} data - Input data
 * @param {Object} options - Feature extraction options
 * @returns {Promise<Object>} - Extracted features
 */
async function extractFeatures(data, options = {}) {
  logger.info('Extracting features from data');
  
  try {
    const {
      method = 'autoencoder',
      dimensions = 10,
      preprocessing = ['normalization'],
      includeMetadata = true
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `feature_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(data));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `feature_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      method,
      dimensions,
      preprocessing,
      include_metadata: includeMetadata
    }));
    
    // Run feature extraction script
    const scriptPath = path.join(__dirname, '../../../python/feature_extraction.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile
    ]);
    
    // Parse results
    return JSON.parse(output);
  } catch (error) {
    logger.error(`Feature extraction failed: ${error.message}`);
    throw new Error('Feature extraction failed');
  }
}

module.exports = {
  trainCrossDisciplinaryModel,
  predictWithModel,
  extractFeatures
};
