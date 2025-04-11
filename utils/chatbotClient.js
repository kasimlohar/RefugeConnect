const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const getChatbotResponse = async (message) => {
  try {
    console.log(`Sending message to Python chatbot service: ${message}`);
    const response = await fetch('http://localhost:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received response from Python chatbot service: ${data.response}`);
    return data.response || 'No response from chatbot.';
  } catch (error) {
    console.error('Error communicating with chatbot service:', error);
    return 'Sorry, the chatbot service is currently unavailable.';
  }
};

module.exports = getChatbotResponse;
