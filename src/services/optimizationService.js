const { Worker } = require('worker_threads');
const os = require('os');

/**
 * Runs CPU-intensive tasks in worker threads
 * @param {Function} taskFn - The task to run
 * @param {Array} workerData - Data for each worker
 * @returns {Promise<Array>} - Results from all workers
 */
function runParallelTasks(taskFn, workerData) {
  const numCPUs = os.cpus().length;
  const workers = [];
  
  return new Promise((resolve, reject) => {
    const results = [];
    let completedWorkers = 0;
    
    for (let i = 0; i < numCPUs; i++) {
      const worker = new Worker(taskFn, { 
        workerData: workerData[i % workerData.length] 
      });
      
      worker.on('message', (result) => {
        results.push(result);
        completedWorkers++;
        
        if (completedWorkers === numCPUs) {
          resolve(results);
        }
      });
      
      worker.on('error', reject);
      workers.push(worker);
    }
  });
}

module.exports = { runParallelTasks };