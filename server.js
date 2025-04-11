const express = require('express');
const path = require('path');
const chatbotRoutes = require('./routes/chatbotRoutes');
const recommendationRoutes = require('./routes/recommendation');
const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Mock database for chat messages
const chatHistory = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'RefugeConnect - Welcome'
    });
});

// app.get('/chat', (req, res) => {
//     res.render('chatbot', { 
//         title: 'RefugeConnect - Chat Assistant',
//         commonQuestions: [
//             'How to find housing?',
//             'Job opportunities',
//             'Healthcare access',
//             'Education resources'
//         ],
//         chatHistory: chatHistory
//     });
// });

// Add signup route
app.get('/signup', (req, res) => {
    res.render('signup', { 
        title: 'Sign Up - RefugeConnect'
    });
});

// Add signup POST handler (placeholder)
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // TODO: Add actual signup logic
    res.json({ success: true });
});

// Use chatbot routes
app.use('/', chatbotRoutes);

// Use recommendation routes
app.use('/', recommendationRoutes);

// Helper function for generating responses
function generateResponse(message) {
    const responses = {
        housing: "I can help you find housing. Would you like to see available options in your area?",
        jobs: "Let me help you find job opportunities. What kind of work are you looking for?",
        healthcare: "I can guide you through healthcare access. Do you need immediate medical attention?",
        education: "I can show you educational resources. Are you interested in schools, language courses, or professional training?",
        default: "How can I assist you today? You can ask about housing, jobs, healthcare, or education."
    };

    message = message.toLowerCase();
    if (message.includes('house') || message.includes('home')) return responses.housing;
    if (message.includes('job') || message.includes('work')) return responses.jobs;
    if (message.includes('health') || message.includes('medical')) return responses.healthcare;
    if (message.includes('education') || message.includes('school')) return responses.education;
    return responses.default;
}

// Error handling
app.use((req, res, next) => {
    res.status(404).render('404', { 
        title: 'Page Not Found' 
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error',
        error: err
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Debug log
});
