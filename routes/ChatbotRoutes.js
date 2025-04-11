const express = require('express');
const router = express.Router();
const getChatbotResponse = require('../utils/chatbotClient');

// Render chatbot interface
router.get('/chatbot', (req, res) => {
  console.log('Rendering chatbot interface.'); // Debug log
  res.render('chatbot', {
    title: 'RefugeConnect - Chat Assistant',
    commonQuestions: [
      'How to find housing?',
      'Job opportunities',
      'Healthcare access',
      'Education resources'
    ]
  });
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