/**
 * Minimal App for E2E Testing
 * This is a simplified version of the main app for E2E testing purposes
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for simulations
const simulations = [];

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/simulations', (req, res) => {
  const { type, parameters } = req.body;
  const simulation = {
    id: `sim-${Date.now()}`,
    type: type || 'default',
    parameters: parameters || {},
    status: 'created',
    createdAt: new Date().toISOString()
  };
  
  simulations.push(simulation);
  res.status(201).json(simulation);
});

app.get('/api/simulations', (req, res) => {
  res.status(200).json(simulations);
});

app.get('/api/simulations/:id', (req, res) => {
  const simulation = simulations.find(s => s.id === req.params.id);
  if (!simulation) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  res.status(200).json(simulation);
});

// Add a DELETE endpoint for the delete test
app.delete('/api/simulations/:id', (req, res) => {
  const index = simulations.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  
  simulations.splice(index, 1);
  res.status(204).send();
});

// HTML routes for testing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CosmosCode Minimal App</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>CosmosCode Minimal App</h1>
        <p>This is a minimal version of the app for E2E testing.</p>
        
        <div class="card">
          <h2>Create Simulation</h2>
          <form id="simulation-form">
            <div>
              <label for="type">Type:</label>
              <input type="text" id="type" name="type" value="cosmology">
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
        
        <div class="card">
          <h2>Simulations</h2>
          <div id="simulations-list">Loading...</div>
        </div>
        
        <script>
          // Simple client-side JavaScript
          document.getElementById('simulation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('type').value;
            
            try {
              const response = await fetch('/api/simulations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
              });
              
              const data = await response.json();
              alert(\`Simulation created: \${data.id}\`);
              loadSimulations();
            } catch (error) {
              console.error('Error creating simulation:', error);
            }
          });
          
          async function loadSimulations() {
            try {
              const response = await fetch('/api/simulations');
              const simulations = await response.json();
              
              const listElement = document.getElementById('simulations-list');
              if (simulations.length === 0) {
                listElement.innerHTML = '<p>No simulations yet.</p>';
                return;
              }
              
              listElement.innerHTML = simulations.map(sim => \`
                <div class="card">
                  <p>ID: \${sim.id}</p>
                  <p>Type: \${sim.type}</p>
                  <p>Status: \${sim.status}</p>
                  <p>Created: \${new Date(sim.createdAt).toLocaleString()}</p>
                </div>
              \`).join('');
            } catch (error) {
              console.error('Error loading simulations:', error);
            }
          }
          
          // Load simulations on page load
          loadSimulations();
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Minimal app running at http://localhost:${port}`);
});
