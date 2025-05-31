const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Retry configuration
let retryCount = 0;
const maxRetries = 5;
const initialRetryDelay = 1000; // 1 second

// Function to reset the API connection
function resetApiConnection() {
  console.log('Resetting API connection...');
  // Re-initialize the API client
  const newGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return newGenAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
}

// Translate with retry logic
async function translateWithRetry(prompt, retryAttempt = 0) {
  try {
    // Use a new model instance if we're retrying
    const currentModel = retryAttempt > 0 ? resetApiConnection() : model;
    
    const result = await currentModel.generateContent(prompt);
    retryCount = 0; // Reset retry count on success
    return result.response.text();
  } catch (error) {
    console.error(`Gemini API error: ${error}`);
    
    // Check if it's a rate limit error (429)
    if (error.message && error.message.includes('429') && retryAttempt < maxRetries) {
      const delay = initialRetryDelay * Math.pow(2, retryAttempt);
      console.log(`Rate limited. Retrying in ${delay/1000} seconds... (Attempt ${retryAttempt + 1}/${maxRetries})`);
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry with incremented attempt count
      return translateWithRetry(prompt, retryAttempt + 1);
    }
    
    // If we've exhausted retries or it's not a rate limit error, use fallback
    return null;
  }
}

async function translateHumanToAnimal(text, animal) {
  const prompt = `Translate the following human text into ${animal} sounds. 
  Be creative and use onomatopoeia to represent how a ${animal} might express this message.
  Human text: "${text}"
  ${animal} translation:`;

  try {
    const translation = await translateWithRetry(prompt);
    if (translation) {
      return { translation, fallback: false };
    }
  } catch (error) {
    console.error(`Translation error: ${error}`);
  }

  // Fallback translations
  const fallbacks = {
    dog: "Woof woof! Bark! Grr... *wags tail* Arf arf!",
    cat: "Meow... Purrrr... *hiss* Mrow! Meow meow.",
    cow: "Moooooo! Moo moo. *snorts* Mooooo!",
    bird: "Tweet! Chirp chirp! *whistles* Caw! Tweet tweet!",
    horse: "Neigh! *whinnies* Snort! Neigh neigh!",
    pig: "Oink oink! *snorts* Squeal! Oink!",
    sheep: "Baaaa! Baa baa! *bleats* Baaaaa!",
    goat: "Maaaa! Bleat! *bleats loudly* Maaaaa!",
    duck: "Quack quack! *waddles* Quaaaack! Quack!",
    chicken: "Cluck cluck! Bawk! *pecks* Cock-a-doodle-doo!"
  };

  return { 
    translation: fallbacks[animal] || "Animal sounds...", 
    fallback: true 
  };
}

async function translateAnimalToHuman(text, animal) {
  const prompt = `Translate the following ${animal} sounds into human language. 
  Be creative and imagine what a ${animal} might be trying to communicate with these sounds.
  ${animal} sounds: "${text}"
  Human translation:`;

  try {
    const translation = await translateWithRetry(prompt);
    if (translation) {
      return { translation, fallback: false };
    }
  } catch (error) {
    console.error(`Translation error: ${error}`);
  }

  // Fallback translations
  return { 
    translation: `I think the ${animal} is trying to say: "Hello human! I'm hungry and want some attention. Please take care of me!"`, 
    fallback: true 
  };
}

module.exports = {
  translateHumanToAnimal,
  translateAnimalToHuman
};
