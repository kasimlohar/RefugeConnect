// index.js: Express routes for the application
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Home route
router.get('/', mainController.home);

// Chatbot route
router.get('/chatbot', mainController.chatbot);

module.exports = router;
