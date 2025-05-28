const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simulation App</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        form { margin-bottom: 20px; }
        select, input, button { margin: 5px; padding: 8px; }
        #results { border: 1px solid #ccc; padding: 10px; display: none; }
      </style>
    </head>
    <body>
      <h1>Cosmology Simulation</h1>
      
      <form id="simulation-form">
        <div>
          <label for="simulation-type">Simulation Type:</label>
          <select id="simulation-type">
            <option value="n-body">N-Body</option>
            <option value="dark-matter">Dark Matter</option>
            <option value="hydro">Hydrodynamic</option>
          </select>
        </div>
        
        <div>
          <label for="complexity">Complexity:</label>
          <select id="complexity">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label for="particles">Particles:</label>
          <input type="number" id="particles" value="100" min="10" max="10000">
        </div>
        
        <button type="submit">Run Simulation</button>
      </form>
      
      <div id="results" style="display: none;">
        <h2>Results</h2>
        <div id="results-content"></div>
        <button id="visualize-button">Visualize</button>
      </div>
      
      <script>
        document.getElementById('simulation-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const type = document.getElementById('simulation-type').value;
          const complexity = document.getElementById('complexity').value;
          const particles = document.getElementById('particles').value;
          
          // Show results
          const results = document.getElementById('results');
          results.style.display = 'block';
          
          document.getElementById('results-content').innerHTML = `
           `<p>Simulation ID: sim-${Date.now()}</p>`
            <p>Type: ${type}</p>
            <p>Complexity: ${complexity}</p>
            <p>Particles: ${particles}</p>
            <p>Status: Completed</p>
          `;
        });
        
        document.getElementById('visualize-button').addEventListener('click', () => {
          // Open a new tab with visualization
          window.open('/visualization.html', '_blank');
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/simulations', (req, res) => {
  const id = `sim-${Date.now()}`;
  res.status(201).json({ 
    id,
    type: req.body.type || 'n-body',
    parameters: req.body.parameters || {},
    status: 'pending'
  });
});

app.get('/api/simulations/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  
  res.status(200).json({
    id,
    type: 'n-body',
    parameters: { particles: 100 },
    status: 'completed',
    results: { energy: 0.5, particles: 100 }
  });
});

app.get('/api/simulations', (req, res) => {
  res.status(200).json({
    simulations: [
      { id: 'sim-1', type: 'n-body', status: 'completed' },
      { id: 'sim-2', type: 'dark-matter', status: 'completed' }
    ]
  });
});

app.delete('/api/simulations/:id', (req, res) => {
  res.status(204).send();
});

// Visualization page
app.get('/visualization.html', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simulation Visualization</title>
    </head>
    <body>
      <h1>Simulation Visualization</h1>
      <div style="width: 500px; height: 500px; background-color: black; position: relative;">
        <!-- Simulated particles -->
        <div style="position: absolute; top: 100px; left: 100px; width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: 200px; left: 150px; width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: 300px; left: 250px; width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: 150px; left: 350px; width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: 250px; left: 400px; width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
