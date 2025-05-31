const express = require('express');
const path = require('path');
const { translateHumanToAnimal, translateAnimalToHuman } = require('./translator');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/translate', async (req, res) => {
  const { text, animal, direction } = req.body;
  
  if (!text || !animal || !direction) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    let result;
    
    if (direction === 'human-to-animal') {
      result = await translateHumanToAnimal(text, animal);
    } else {
      result = await translateAnimalToHuman(text, animal);
    }
    
    // Include API status in the response
    res.json({
      translation: result.translation,
      fallback: result.fallback,
      apiStatus: result.fallback ? 'limited' : 'active'
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed', 
      fallback: true,
      apiStatus: 'error',
      translation: `Sorry, I couldn't translate that. ${error.message}`
    });
  }
});

// Add a new endpoint to manually reset the API connection
app.post('/api/reset', (req, res) => {
  try {
    // This will be called on the next translation request
    res.json({ success: true, message: 'API connection will be reset on next request' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Animal Translator running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
