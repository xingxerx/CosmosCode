document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('translation-form');
  const resultDiv = document.getElementById('translation-result');
  const apiStatusDiv = document.getElementById('api-status');
  const resetButton = document.getElementById('reset-api');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const text = document.getElementById('text').value;
      const animal = document.getElementById('animal').value;
      const direction = document.querySelector('input[name="direction"]:checked').value;
      
      if (!text || !animal || !direction) {
        resultDiv.innerHTML = '<p class="error">Please fill out all fields</p>';
        return;
      }
      
      resultDiv.innerHTML = '<p>Translating...</p>';
      
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text, animal, direction })
        });
        
        const data = await response.json();
        
        if (data.error) {
          resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
          return;
        }
        
        // Update the translation result
        resultDiv.innerHTML = `
          <h3>Translation:</h3>
          <p class="translation">${data.translation}</p>
          ${data.fallback ? '<p class="fallback-notice">This is a fallback translation. The AI is currently rate-limited.</p>' : ''}
        `;
        
        // Update API status
        updateApiStatus(data.apiStatus);
        
      } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      }
    });
  }
  
  // Add event listener for reset button
  if (resetButton) {
    resetButton.addEventListener('click', async function() {
      try {
        resetButton.disabled = true;
        resetButton.textContent = 'Resetting...';
        
        const response = await fetch('/api/reset', {
          method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
          apiStatusDiv.innerHTML = '<p class="status pending">API connection will reset on next request</p>';
        } else {
          apiStatusDiv.innerHTML = `<p class="status error">Reset failed: ${data.error}</p>`;
        }
      } catch (error) {
        apiStatusDiv.innerHTML = `<p class="status error">Reset failed: ${error.message}</p>`;
      } finally {
        resetButton.disabled = false;
        resetButton.textContent = 'Reset API Connection';
      }
    });
  }
  
  function updateApiStatus(status) {
    if (!apiStatusDiv) return;
    
    let statusHtml = '';
    
    switch(status) {
      case 'active':
        statusHtml = '<p class="status active">API Status: Active</p>';
        break;
      case 'limited':
        statusHtml = '<p class="status limited">API Status: Rate Limited</p>';
        break;
      case 'error':
        statusHtml = '<p class="status error">API Status: Error</p>';
        break;
      default:
        statusHtml = '<p class="status unknown">API Status: Unknown</p>';
    }
    
    apiStatusDiv.innerHTML = statusHtml;
  }
});
