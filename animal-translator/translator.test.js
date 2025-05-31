const translator = require('./translator');

// Save the original function
const originalTranslateText = translator.translateText;

describe('Translator Module', () => {
  // Mock the translateText function for testing
  beforeEach(() => {
    translator.translateText = jest.fn().mockImplementation((text, direction, animal) => {
      if (direction === 'human-to-animal' && animal === 'dog') {
        return Promise.resolve("Woof woof! *wags tail excitedly*");
      } else if (direction === 'animal-to-human' && animal === 'cat') {
        return Promise.resolve("I'm hungry, please feed me now.");
      } else {
        return Promise.resolve("Mock translation response");
      }
    });
  });

  // Restore the original function after tests
  afterEach(() => {
    translator.translateText = originalTranslateText;
  });

  test('translates from human to dog language', async () => {
    const result = await translator.translateText('Hello, how are you?', 'human-to-animal', 'dog');
    expect(result).toBe("Woof woof! *wags tail excitedly*");
  });

  test('translates from cat to human language', async () => {
    const result = await translator.translateText('Meow meow purr', 'animal-to-human', 'cat');
    expect(result).toBe("I'm hungry, please feed me now.");
  });
});
