// Create a minimal test file to isolate the issue
try {
    const response = { ok: false, status: 404 };
    
    if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
    }
} catch (error) {
    console.error('Error:', error);
}