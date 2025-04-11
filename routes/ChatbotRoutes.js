const express = require('express');
const router = express.Router();
const getChatbotResponse = require('../utils/chatbotClient');

// Render chatbot interface
router.get('/chatbot', async (req, res) => {
  console.log('Rendering chatbot interface.'); // Debug log

  try {
    // Fetch conversation history from the database (mock implementation)
    const conversationHistory = [
      { sender: 'user', text: 'Hello!' },
      { sender: 'assistant', text: 'Hi! How can I assist you today?' },
      { sender: 'user', text: 'I need help finding housing.' },
      { sender: 'assistant', text: 'Sure! I can help you with that. Do you have a specific location in mind?' }
    ];

    res.render('chatbot', {
      title: 'RefugeConnect - Chat Assistant',
      activePage: 'chatbot', // Define activePage for the chatbot route
      conversationHistory, // Pass conversationHistory to the template
      commonQuestions: [
        'How to find housing?',
        'Job opportunities',
        'Healthcare access',
        'Education resources'
      ]
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error.message || error);
    res.render('chatbot', {
      title: 'RefugeConnect - Chat Assistant',
      activePage: 'chatbot',
      conversationHistory: [], // Pass an empty array if there's an error
      commonQuestions: [
        'How to find housing?',
        'Job opportunities',
        'Healthcare access',
        'Education resources'
      ]
    });
  }
});

// Handle chatbot API requests
router.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    console.error('Error: Message is missing in the request body.');
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  try {
    console.log(`Received message: ${message}`);
    const response = await getChatbotResponse(message);
    console.log(`Chatbot response: ${response}`);
    res.json({ success: true, response });
  } catch (error) {
    console.error('Error in chatbot API:', error.message || error);
    res.status(500).json({ success: false, error: 'The chatbot service is currently unavailable. Please try again later.' });
  }
});

module.exports = router;