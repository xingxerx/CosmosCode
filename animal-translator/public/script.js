document.addEventListener('DOMContentLoaded', () => {
  const translateBtn = document.getElementById('translateBtn');
  const inputText = document.getElementById('inputText');
  const direction = document.getElementById('direction');
  const animal = document.getElementById('animal');
  const result = document.getElementById('result');
  const outputText = document.getElementById('outputText');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('errorMessage');
  
  translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    
    if (!text) {
      showError('Please enter some text to translate');
      return;
    }
    
    // Show loading indicator
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    result.style.display = 'none';
    
    try {
      const response = await fetch('/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          direction: direction.value,
          animal: animal.value
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Translation failed');
      }
      
      // Display result
      outputText.textContent = data.translation;
      result.style.display = 'block';
      
      // If it's a fallback response, add a warning class
      if (data.isFallback) {
        result.classList.add('api-limited');
      } else {
        result.classList.remove('api-limited');
      }
      
    } catch (error) {
      showError(error.message);
    } finally {
      loading.style.display = 'none';
    }
  });
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    result.style.display = 'none';
  }
});
