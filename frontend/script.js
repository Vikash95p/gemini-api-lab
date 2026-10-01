document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');

    // Make sure the backend is running at this URL
    const API_URL = 'http://127.0.0.1:8000/api/chat';

    function addMessage(sender, text, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        if (isError) {
            messageDiv.classList.add('error');
        } else {
            messageDiv.classList.add(sender.toLowerCase());
        }

        const label = document.createElement('div');
        label.classList.add('message-label');
        label.textContent = isError ? 'Error' : sender;

        const content = document.createElement('div');
        content.textContent = text;

        messageDiv.appendChild(label);
        messageDiv.appendChild(content);
        chatHistory.appendChild(messageDiv);

        // Scroll to the bottom to see the latest message
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('loading');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.textContent = 'Gemini is thinking...';
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loadingDiv = document.getElementById('loading-indicator');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    async function sendMessage() {
        const text = messageInput.value.trim();
        // Validation for empty messages
        if (!text) return;

        // Display user message in UI
        addMessage('You', text);
        messageInput.value = '';
        
        // Disable input elements while waiting for the response
        messageInput.disabled = true;
        sendButton.disabled = true;
        addLoadingIndicator();

        try {
            // Send the API request to our FastAPI backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Handle non-200 responses
            if (!response.ok) {
                throw new Error(data.detail || 'Failed to connect to the backend.');
            }

            // Display Gemini's generated response
            addMessage('Gemini', data.response);
        } catch (error) {
            // Gracefully handle missing API key or other server errors
            addMessage('System', error.message, true);
        } finally {
            // Re-enable inputs
            removeLoadingIndicator();
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    sendButton.addEventListener('click', sendMessage);

    // Support sending on "Enter" key press
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    clearButton.addEventListener('click', () => {
        chatHistory.innerHTML = '';
    });
});
