const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Conversation = require('../models/Conversation');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Seed conversational data
const seedConversations = async () => {
    try {
        // Clear existing conversations
        await Conversation.deleteMany();
        console.log('Existing conversations cleared.');

        // Conversational data
        const conversations = [
            {
                userInput: 'How do I register as a refugee in Delhi?',
                botResponse: 'To register as a refugee in Delhi, you need to visit the UNHCR office at 14 Jor Bagh, New Delhi. Bring any identity documents you have, even if expired. The registration process includes an interview and issuance of a UNHCR asylum seeker certificate. Office hours are Monday to Thursday, 9:30 AM to 12:30 PM.',
                timestamp: '2025-03-18T14:23:15Z'
            },
            {
                userInput: "I need medical help but I don't have money. What can I do?",
                botResponse: "You can access free or low-cost healthcare through several options: 1) Refugee Health Initiative Clinics provide free services for registered refugees, 2) Government hospitals offer subsidized rates, 3) NGO mobile clinics visit refugee communities regularly. For emergencies, go to any hospital's emergency department - they cannot refuse treatment. Would you like me to list the nearest facilities to your location?",
                timestamp: '2025-03-17T09:45:30Z'
            },
            {
                userInput: 'My children need to go to school. How can I enroll them?',
                botResponse: "All children in India have the right to education under the Right to Education Act. To enroll your children: 1) Visit the nearest government school with any available documentation, 2) If you have UNHCR registration, bring that document, 3) NGOs like 'Education for All' can help with the enrollment process and provide school supplies. Some schools may require an address proof, which can be a rent agreement or a letter from a local NGO.",
                timestamp: '2025-03-15T11:32:05Z'
            },
            {
                userInput: "I've been threatened by someone in my neighborhood. Who can help me?",
                botResponse: "I'm sorry to hear that you're facing threats. Your safety is important. Please contact: 1) Local police station to file a complaint, 2) UNHCR Protection Hotline at +91-11-43530244, 3) Refugee support NGOs like 'Safe Haven' at +91-98765-43210 who provide emergency assistance. Document any incidents with dates and details if possible. If you're in immediate danger, call the police emergency number 100.",
                timestamp: '2025-03-16T18:05:42Z'
            },
            {
                userInput: 'How can I find work legally in India?',
                botResponse: "As a refugee, you can work in the informal sector while your case is being processed. If you have official refugee status from UNHCR, you can apply for a work permit through the Foreigners Regional Registration Office (FRRO). Many NGOs offer vocational training and job placement services specifically for refugees. Organizations like 'Skills & Employment' and 'Refugee Livelihoods Initiative' can help with job searches and entrepreneurship opportunities.",
                timestamp: '2025-03-14T15:20:18Z'
            }
        ];

        // Insert conversations into the database
        await Conversation.insertMany(conversations);
        console.log('Conversations seeded successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding conversations:', err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedConversations();
})();
