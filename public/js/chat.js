document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = e.target.querySelector('input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    appendMessage('user', message);
    input.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Add assistant response to chat
        appendMessage('assistant', data.response);
        
    } catch (error) {
        console.error('Error:', error);
        appendMessage('assistant', 'Sorry, there was an error processing your request.');
    }
});

function appendMessage(type, content) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'assistant') {
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">${content}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <i class="fas fa-user"></i>
        `;
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
