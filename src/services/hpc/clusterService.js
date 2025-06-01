const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');
const config = require('../../config');

/**
 * Service for interacting with HPC clusters
 */
class ClusterService {
  constructor() {
    this.config = config.hpc;
    this.jobTemplatesDir = path.join(__dirname, '../../../templates/hpc');
  }
  
  /**
   * Submits a job to the HPC cluster
   * @param {string} jobType - Type of job to submit
   * @param {Object} parameters - Job parameters
   * @returns {Promise<Object>} - Job submission info
   */
  async submitJob(jobType, parameters) {
    // Get appropriate template
    const templatePath = path.join(this.jobTemplatesDir, `${jobType}.template`);
    let template;
    
    try {
      template = await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      throw new Error(`Job template not found: ${jobType}`);
    }
    
    // Replace template variables
    const jobScript = this._processTemplate(template, parameters);
    
    // Create job directory
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const jobDir = path.join(this.config.jobsDir, jobId);
    await fs.mkdir(jobDir, { recursive: true });
    
    // Write job script
    const scriptPath = path.join(jobDir, 'job.sh');
    await fs.writeFile(scriptPath, jobScript);
    
    // Write parameters file
    await fs.writeFile(
      path.join(jobDir, 'parameters.json'),
      JSON.stringify(parameters, null, 2)
    );
    
    // Submit job
    return new Promise((resolve, reject) => {
      const command = `cd ${jobDir} && ${this.config.submitCommand} job.sh`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Job submission failed: ${error.message}`);
          reject(error);
          return;
        }
        
        // Parse job ID from scheduler output
        const schedulerJobId = this._parseJobId(stdout);
        
        resolve({
          jobId,
          schedulerJobId,
          jobDir,
          parameters,
          submittedAt: new Date()
        });
      });
    });
  }
  
  /**
   * Checks the status of a submitted job
   * @param {string} schedulerJobId - Job ID from the scheduler
   * @returns {Promise<Object>} - Job status
   */
  async checkJobStatus(schedulerJobId) {
    return new Promise((resolve, reject) => {
      const command = `${this.config.statusCommand} ${schedulerJobId}`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          // If the job is not found, it might be completed
          if (error.message.includes('not found')) {
            resolve({ status: 'COMPLETED', details: null });
            return;
          }
          
          logger.error(`Job status check failed: ${error.message}`);
          reject(error);
          return;
        }
        
        const status = this._parseJobStatus(stdout);
        resolve(status);
      });
    });
  }
  
  /**
   * Retrieves results from a completed job
   * @param {string} jobId - Internal job ID
   * @returns {Promise<Object>} - Job results
   */
  async getJobResults(jobId) {
    const jobDir = path.join(this.config.jobsDir, jobId);
    const resultsFile = path.join(jobDir, 'results.json');
    
    try {
      const results = JSON.parse(await fs.readFile(resultsFile, 'utf8'));
      return {
        jobId,
        results,
        outputFiles: await this._listOutputFiles(jobDir)
      };
    } catch (error) {
      logger.error(`Failed to retrieve job results: ${error.message}`);
      throw new Error('Job results not available');
    }
  }
  
  /**
   * Processes a template by replacing variables
   * @private
   */
  _processTemplate(template, parameters) {
    let result = template;
    
    // Replace template variables
    for (const [key, value] of Object.entries(parameters)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    
    // Replace config variables
    for (const [key, value] of Object.entries(this.config)) {
      if (typeof value === 'string') {
        const placeholder = `{{config.${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    
    return result;
  }
  
  /**
   * Parses job ID from scheduler output
   * @private
   */
  _parseJobId(output) {
    // Implementation depends on scheduler (SLURM, PBS, etc.)
    const match = output.match(/Submitted batch job (\d+)/);
    return match ? match[1] : null;
  }
  
  /**
   * Parses job status from scheduler output
   * @private
   */
  _parseJobStatus(output) {
    // Implementation depends on scheduler
    // ...
  }
  
  /**
   * Lists output files in the job directory
   * @private
   */
  async _listOutputFiles(jobDir) {
    // Implementation
  }
}

module.exports = new ClusterService();