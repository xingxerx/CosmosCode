const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

describe('End-to-End Tests', () => {
  let browser;
  let page;
  let serverProcess;
  
  // Start the server and browser before tests
  beforeAll(async () => {
    // Start the server
    serverProcess = spawn('node', ['minimal-app.js'], {
      env: { ...process.env, PORT: '3000' },
      stdio: 'pipe'
    });
    
    // Wait for server to be available
    await waitOn({ resources: ['http://localhost:3000'] });
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    
    page = await browser.newPage();
  }, 30000);
  
  // Close browser and server after tests
  afterAll(async () => {
    await browser.close();
    serverProcess.kill();
  });
  
  test('can run a simulation and view results', async () => {
    await page.goto('http://localhost:3000');
    
    // Fill the form
    await page.select('#simulation-type', 'n-body');
    await page.select('#complexity', 'low');
    await page.type('#particles', '100');
    
    // Submit the form
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForSelector('#results', { visible: true })
    ]);
    
    // Check if results are displayed
    const resultsText = await page.$eval('#results-content', el => el.textContent);
    expect(resultsText).toContain('Simulation ID');
    expect(resultsText).toContain('Status');
    
    // Try to visualize
    await Promise.all([
      page.click('#visualize-button'),
      page.waitForTimeout(1000) // Wait for the visualization request to complete
    ]);
    
    // Check if a new tab was opened (for visualization)
    const pages = await browser.pages();
    expect(pages.length).toBeGreaterThan(1);
  }, 60000);
});