const { translateText } = require('./translator');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai');

describe('Translator Module', () => {
  let mockGenerateContent;
  let mockGetGenerativeModel;
  
  beforeEach(() => {
    // Create mock functions
    mockGenerateContent = jest.fn();
    mockGetGenerativeModel = jest.fn(() => ({
      generateContent: mockGenerateContent
    }));
    
    // Set up the mock implementation
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('translateText should call Gemini API with correct prompt for human-to-animal', async () => {
    // Mock successful response
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Woof woof! *wags tail excitedly*' }
    });
    
    const result = await translateText('Hello, how are you?', 'human-to-animal', 'dog');
    
    // Check the result
    expect(result).toBe('Woof woof! *wags tail excitedly*');
    
    // Verify the model was created with the correct parameters
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-pro' });
    
    // Verify the prompt contains the right information
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateContent.mock.calls[0][0];
    expect(promptArg).toContain('You are an expert in animal communication for dogs');
    expect(promptArg).toContain('Human text: "Hello, how are you?"');
  });
  
  test('translateText should call Gemini API with correct prompt for animal-to-human', async () => {
    // Mock successful response
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'I\'m excited to see you and I\'m doing well!' }
    });
    
    const result = await translateText('Woof woof! *wags tail*', 'animal-to-human', 'dog');
    
    // Check the result
    expect(result).toBe('I\'m excited to see you and I\'m doing well!');
    
    // Verify the prompt contains the right information
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateContent.mock.calls[0][0];
    expect(promptArg).toContain('You are an expert in animal communication for dogs');
    expect(promptArg).toContain('dog sounds: "Woof woof! *wags tail*"');
  });
  
  test('translateText should handle unknown animal types', async () => {
    // Mock successful response
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'Chirp chirp!' }
    });
    
    const result = await translateText('Hello there', 'human-to-animal', 'parrot');
    
    // Check the result
    expect(result).toBe('Chirp chirp!');
    
    // Verify the prompt contains generic information for unknown animal
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateContent.mock.calls[0][0];
    expect(promptArg).toContain('You are an expert in animal communication for parrots');
    expect(promptArg).toContain('parrots communicate in their own way');
  });
  
  test('translateText should provide fallback response when API returns an error', async () => {
    // Mock API error
    mockGenerateContent.mockRejectedValue(new Error('429 Too Many Requests: You exceeded your current quota'));
    
    const result = await translateText('Hello there', 'human-to-animal', 'dog');
    
    // Check that we get a fallback response
    expect(result).toContain('Fallback translation due to API limits');
    expect(result).toContain('bark');
  });
  
  test('translateText should provide different fallback responses based on direction', async () => {
    // Mock API error
    mockGenerateContent.mockRejectedValue(new Error('429 Too Many Requests'));
    
    // Test human-to-animal fallback
    const humanToAnimal = await translateText('Hello there', 'human-to-animal', 'cat');
    expect(humanToAnimal).toContain('meow');
    expect(humanToAnimal).toContain('Fallback translation due to API limits');
    
    // Test animal-to-human fallback
    const animalToHuman = await translateText('Meow meow purr', 'animal-to-human', 'cat');
    expect(animalToHuman).toContain('The cat seems to be trying to communicate');
    expect(animalToHuman).toContain('Fallback translation due to API limits');
  });
  
  test('translateText should rethrow non-rate-limit errors', async () => {
    // Mock a different kind of error
    mockGenerateContent.mockRejectedValue(new Error('Network error'));
    
    // The function should throw the error
    await expect(translateText('Hello', 'human-to-animal', 'dog')).rejects.toThrow('Network error');
  });
});
