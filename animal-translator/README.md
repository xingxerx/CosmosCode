# Animal Translator

An application that translates between human language and animal sounds using Google's Gemini AI.

## Features

- Translate from human language to animal sounds/behavior
- Translate from animal sounds to human language
- Support for multiple animal types (dogs, cats, cows, etc.)
- Fallback responses when API rate limits are reached
- Simple and intuitive web interface

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3001
   ```
4. Start the application:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3001`
2. Select the translation direction (human-to-animal or animal-to-human)
3. Choose an animal type
4. Enter the text you want to translate
5. Click the "Translate" button
6. View the translation result

## API Endpoints

### POST /translate

Translates text between human language and animal sounds.

**Request Body:**
```json
{
  "text": "Hello, how are you?",
  "direction": "human-to-animal",
  "animal": "dog"
}
```

**Response:**
```json
{
  "translation": "Woof woof! *wags tail excitedly*",
  "isFallback": false,
  "apiStatus": "ok"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Testing

Run the tests with:
```
npm test
```

## License

ISC