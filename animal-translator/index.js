require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { translateText } = require('./translator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/translate', async (req, res) => {
  try {
    const { text, direction, animal } = req.body;
    
    if (!text || !direction || !animal) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'Please provide text, direction, and animal type'
      });
    }
    
    // Add rate limiting for the API endpoint
    // This is a simple implementation - in production you'd want a more robust solution
    const result = await translateText(text, direction, animal);
    
    // Check if it's a fallback response
    const isFallback = result.includes('Fallback translation due to API limits');
    
    res.json({ 
      translation: result,
      isFallback: isFallback,
      apiStatus: isFallback ? 'limited' : 'ok'
    });
  } catch (error) {
    console.error('Translation error:', error);
    
    // Provide a more user-friendly error message
    let errorMessage = 'Translation failed';
    let errorDetails = error.message;
    
    if (error.message.includes('429') || error.message.includes('quota')) {
      errorMessage = 'API rate limit exceeded';
      errorDetails = 'The translation service is currently experiencing high demand. Please try again later.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Animal Translator running on http://localhost:${PORT}`);
});
