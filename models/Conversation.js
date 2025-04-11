const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userInput: { type: String, required: true },
    botResponse: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional reference to User
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
