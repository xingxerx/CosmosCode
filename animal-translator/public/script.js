document.addEventListener('DOMContentLoaded', () => {
  const animalSelect = document.getElementById('animal-select');
  const directionSelect = document.getElementById('direction-select');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const translateBtn = document.getElementById('translate-btn');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');

  // Update placeholder based on selected direction and animal
  function updatePlaceholder() {
    const animal = animalSelect.value;
    const direction = directionSelect.value;
    
    if (direction === 'human-to-animal') {
      inputText.placeholder = `Enter human text to translate to ${animal} language...`;
      outputText.placeholder = `${animal.charAt(0).toUpperCase() + animal.slice(1)} translation will appear here...`;
    } else {
      inputText.placeholder = `Enter ${animal} sounds to translate to human language...`;
      outputText.placeholder = 'Human translation will appear here...';
    }
  }

  // Event listeners for select changes
  animalSelect.addEventListener('change', updatePlaceholder);
  directionSelect.addEventListener('change', updatePlaceholder);
  
  // Initialize placeholder
  updatePlaceholder();

  // Handle translation
  translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    const animal = animalSelect.value;
    const direction = directionSelect.value;
    
    if (!text) {
      showError('Please enter some text to translate');
      return;
    }
    
    // Show loading indicator
    loading.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    outputText.value = '';
    
    try {
      const response = await fetch('/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, animal, direction })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Translation failed');
      }
      
      const data = await response.json();
      outputText.value = data.translation;
    } catch (error) {
      showError(error.message);
    } finally {
      loading.classList.add('hidden');
    }
  });
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
});