const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-tests');

// Animal sound dictionary for reference
const animalSounds = {
  dog: { sound: "bark/woof", description: "Dogs communicate through barks, growls, whines and body language" },
  cat: { sound: "meow", description: "Cats use meows, purrs, hisses and body postures to communicate" },
  cow: { sound: "moo", description: "Cows communicate with moos of varying pitch and duration" },
  chicken: { sound: "cluck/bawk", description: "Chickens use different clucks and calls for various situations" },
  horse: { sound: "neigh/whinny", description: "Horses communicate through whinnies, nickers, and snorts" },
  pig: { sound: "oink", description: "Pigs use grunts and squeals of different intensities" },
  sheep: { sound: "baa", description: "Sheep communicate with bleats of varying tones" },
  goat: { sound: "maa", description: "Goats use bleats and calls of different pitches" },
  duck: { sound: "quack", description: "Ducks communicate through quacks and other vocalizations" },
  frog: { sound: "ribbit/croak", description: "Frogs use croaks and calls, often to attract mates" }
};

/**
 * Generates a fallback response when the API is unavailable
 * @param {string} text - The text to translate
 * @param {string} direction - Either "human-to-animal" or "animal-to-human"
 * @param {string} animal - The type of animal
 * @returns {string} - A fallback translation
 */
function generateFallbackResponse(text, direction, animal) {
  const animalType = animal.toLowerCase();
  const animalInfo = animalSounds[animalType] || { sound: "unknown" };
  
  if (direction === 'human-to-animal') {
    const sounds = animalInfo.sound.split('/')[0]; // Take the first sound if multiple
    return `${sounds} ${sounds}! (Fallback translation due to API limits)`;
  } else {
    return `The ${animalType} seems to be trying to communicate something. (Fallback translation due to API limits)`;
  }
}

/**
 * Translates text between human language and animal sounds
 * @param {string} text - The text to translate
 * @param {string} direction - Either "human-to-animal" or "animal-to-human"
 * @param {string} animal - The type of animal (e.g., "dog", "cat")
 * @returns {Promise<string>} - The translated text
 */
async function translateText(text, direction, animal) {
  // Normalize animal type to lowercase
  const animalType = animal.toLowerCase();
  
  try {
    // Get animal information
    const animalInfo = animalSounds[animalType] || 
      { sound: "unknown", description: `${animalType}s communicate in their own way` };
    
    // Create prompt based on direction
    let prompt;
    if (direction === 'human-to-animal') {
      prompt = `You are an expert in animal communication for ${animalType}s. 
      ${animalInfo.description}. 
      Translate the following human text into how a ${animalType} might express it using their sounds and behavior.
      Be creative but realistic about how ${animalType}s actually communicate.
      Human text: "${text}"
      ${animalType} translation:`;
    } else {
      prompt = `You are an expert in animal communication for ${animalType}s.
      ${animalInfo.description}.
      The following text represents ${animalType} sounds and behavior.
      Translate it into human language, interpreting what the ${animalType} might be trying to communicate.
      ${animalType} sounds: "${text}"
      Human translation:`;
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    
    // Check if it's a rate limit error
    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
      return generateFallbackResponse(text, direction, animal);
    }
    
    // Re-throw other errors
    throw error;
  }
}

module.exports = { translateText };
