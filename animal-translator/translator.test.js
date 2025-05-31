const { translateText } = require('./translator');

// Mock the Gemini API
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            generateContent: jest.fn().mockImplementation((prompt) => {
              // Simple mock responses based on input
              if (prompt.includes('human-to-animal') && prompt.includes('dog')) {
                return Promise.resolve({
                  response: { text: () => "Woof woof! *wags tail excitedly*" }
                });
              } else if (prompt.includes('animal-to-human') && prompt.includes('cat')) {
                return Promise.resolve({
                  response: { text: () => "I'm hungry, please feed me now." }
                });
              } else {
                return Promise.resolve({
                  response: { text: () => "Mock translation response" }
                });
              }
            })
          };
        })
      };
    })
  };
});

describe('Translator Module', () => {
  test('translates from human to dog language', async () => {
    const result = await translateText('Hello, how are you?', 'human-to-animal', 'dog');
    expect(result).toContain('Woof');
  });

  test('translates from cat to human language', async () => {
    const result = await translateText('Meow meow purr', 'animal-to-human', 'cat');
    expect(result).toContain('hungry');
  });
});