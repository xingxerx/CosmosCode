const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { translateText } = require('./translator');

// Mock the translator module
jest.mock('./translator', () => ({
  translateText: jest.fn()
}));

// Create a test app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add the routes we want to test
app.post('/translate', async (req, res) => {
  try {
    const { text, direction, animal } = req.body;
    
    if (!text || !direction || !animal) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'Please provide text, direction, and animal type'
      });
    }
    
    const result = await translateText(text, direction, animal);
    
    // Check if it's a fallback response
    const isFallback = result.includes('Fallback translation due to API limits');
    
    res.json({ 
      translation: result,
      isFallback: isFallback,
      apiStatus: isFallback ? 'limited' : 'ok'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Translation failed', 
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('API Endpoints', () => {
  beforeEach(() => {
    // Reset mock before each test
    translateText.mockReset();
  });

  test('GET /health returns ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /translate returns translation', async () => {
    // Mock the translation function
    translateText.mockResolvedValue('Woof woof! *wags tail excitedly*');
    
    const response = await request(app)
      .post('/translate')
      .send({
        text: 'Hello, how are you?',
        direction: 'human-to-animal',
        animal: 'dog'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      translation: 'Woof woof! *wags tail excitedly*',
      isFallback: false,
      apiStatus: 'ok'
    });
    expect(translateText).toHaveBeenCalledWith(
      'Hello, how are you?', 
      'human-to-animal', 
      'dog'
    );
  });

  test('POST /translate handles fallback responses', async () => {
    // Mock a fallback response
    translateText.mockResolvedValue('woof woof! (Fallback translation due to API limits)');
    
    const response = await request(app)
      .post('/translate')
      .send({
        text: 'Hello, how are you?',
        direction: 'human-to-animal',
        animal: 'dog'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      translation: 'woof woof! (Fallback translation due to API limits)',
      isFallback: true,
      apiStatus: 'limited'
    });
  });

  test('POST /translate returns 400 for missing parameters', async () => {
    const response = await request(app)
      .post('/translate')
      .send({
        text: 'Hello, how are you?',
        // Missing direction and animal
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required parameters');
  });

  test('POST /translate handles API errors', async () => {
    // Mock an error
    translateText.mockRejectedValue(new Error('API error'));
    
    const response = await request(app)
      .post('/translate')
      .send({
        text: 'Hello, how are you?',
        direction: 'human-to-animal',
        animal: 'dog'
      });
    
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Translation failed');
    expect(response.body).toHaveProperty('details', 'API error');
  });
});