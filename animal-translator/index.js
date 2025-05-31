require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { translateText } = require('./translator');

const app = express();
const PORT = process.env.PORT || 3001; // Changed default port to 3001

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
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const result = await translateText(text, direction, animal);
    res.json({ translation: result });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Animal Translator running on http://localhost:${PORT}`);
});
