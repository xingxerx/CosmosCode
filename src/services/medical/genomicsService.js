const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const os = require('os');

/**
 * Analyzes genomic data for medical insights
 * @param {Object} genomicData - Genomic sequence data
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeGenomicData(genomicData, options = {}) {
  logger.info('Starting genomic data analysis');
  
  try {
    const {
      analysisType = 'variant-calling',
      referenceGenome = 'GRCh38',
      includeAnnotation = true,
      confidenceThreshold = 0.95,
      filterRare = false,
      minAlleleFrequency = 0.01
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `genomic_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(genomicData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `genomic_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      analysis_type: analysisType,
      reference_genome: referenceGenome,
      include_annotation: includeAnnotation,
      confidence_threshold: confidenceThreshold,
      filter_rare: filterRare,
      min_allele_frequency: minAlleleFrequency
    }));
    
    // Run analysis script
    const scriptPath = path.join(__dirname, '../../../python/genomic_analysis.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      variants: results.variants,
      annotations: results.annotations,
      statistics: results.statistics,
      pathogenicVariants: results.pathogenic_variants || [],
      pharmacogenomics: results.pharmacogenomics || {},
      metadata: {
        analysisType,
        referenceGenome,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logger.error(`Genomic analysis failed: ${error.message}`);
    throw new Error('Genomic data analysis failed');
  }
}

/**
 * Identifies genetic risk factors for diseases
 * @param {Object} genomicData - Genomic data
 * @param {Array} diseases - List of diseases to check
 * @returns {Promise<Object>} - Risk assessment results
 */
async function assessDiseaseRisk(genomicData, diseases = []) {
  logger.info('Starting disease risk assessment');
  
  try {
    // Create data file
    const dataFile = path.join(os.tmpdir(), `risk_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify({
      genomicData,
      diseases
    }));
    
    // Run risk assessment script
    const scriptPath = path.join(__dirname, '../../../python/disease_risk.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      overallRisk: results.overall_risk,
      diseaseRisks: results.disease_risks,
      contributingVariants: results.contributing_variants,
      recommendations: results.recommendations || [],
      confidence: results.confidence
    };
  } catch (error) {
    logger.error(`Disease risk assessment failed: ${error.message}`);
    throw new Error('Genetic disease risk assessment failed');
  }
}

/**
 * Analyzes pharmacogenomic data for medication response
 * @param {Object} genomicData - Genomic data
 * @param {Array} medications - List of medications to check
 * @returns {Promise<Object>} - Pharmacogenomic results
 */
async function analyzeMedicationResponse(genomicData, medications = []) {
  logger.info('Starting pharmacogenomic analysis');
  
  try {
    // Create data file
    const dataFile = path.join(os.tmpdir(), `pgx_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify({
      genomicData,
      medications
    }));
    
    // Run pharmacogenomic script
    const scriptPath = path.join(__dirname, '../../../python/pharmacogenomics.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      metabolizerStatus: results.metabolizer_status,
      medicationRecommendations: results.medication_recommendations,
      adverseEffectRisks: results.adverse_effect_risks,
      dosingGuidelines: results.dosing_guidelines || [],
      alternativeMedications: results.alternative_medications || {}
    };
  } catch (error) {
    logger.error(`Pharmacogenomic analysis failed: ${error.message}`);
    throw new Error('Medication response analysis failed');
  }
}

module.exports = {
  analyzeGenomicData,
  assessDiseaseRisk,
  analyzeMedicationResponse
};