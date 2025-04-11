const express = require('express');
const path = require('path');
const chatbotRoutes = require('./routes/chatbotRoutes');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assuming User model is already created
const authMiddleware = require('./middleware/authMiddleware'); // Placeholder for role-based access control
const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Mock database for chat messages
const chatHistory = [];

// Mock data for dashboard
const mockData = {
    user: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/32'
    },
    locations: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    jobs: [
        {
            id: 1,
            title: 'Restaurant Server',
            company: 'Local Bistro',
            location: 'Downtown'
        },
        {
            id: 2,
            title: 'Warehouse Worker',
            company: 'LogiCorp',
            location: 'Industrial District'
        },
        {
            id: 3,
            title: 'Retail Associate',
            company: 'MegaMart',
            location: 'Shopping Center'
        }
    ],
    housing: [
        {
            id: 1,
            type: 'Studio Apartment',
            price: '$800/month',
            location: 'City Center'
        },
        {
            id: 2,
            type: 'Shared Room',
            price: '$400/month',
            location: 'University Area'
        },
        {
            id: 3,
            type: 'Family Home',
            price: '$1200/month',
            location: 'Suburbs'
        }
    ],
    healthcare: [
        {
            id: 1,
            name: 'Community Clinic',
            type: 'General Healthcare',
            location: 'Downtown'
        },
        {
            id: 2,
            name: 'Family Medical Center',
            type: 'Primary Care',
            location: 'East Side'
        },
        {
            id: 3,
            name: 'Wellness Center',
            type: 'Preventive Care',
            location: 'West Side'
        }
    ]
};

// Add mock property data
const mockProperty = {
    id: 1,
    title: 'Family Apartment in Downtown',
    price: '$1,200/month',
    status: 'Available',
    mainPhoto: 'https://via.placeholder.com/800x500',
    photos: [
        'https://via.placeholder.com/200x150',
        'https://via.placeholder.com/200x150',
        'https://via.placeholder.com/200x150',
        'https://via.placeholder.com/200x150'
    ],
    bedrooms: 2,
    bathrooms: 1,
    area: '950',
    description: 'Spacious family apartment located in the heart of downtown...',
    amenities: ['Heating', 'Air Conditioning', 'Furnished', 'Parking'],
    address: '123 Main St, Downtown',
    agent: {
        name: 'Sarah Johnson',
        role: 'Housing Coordinator',
        photo: 'https://via.placeholder.com/48'
    }
};

// Add help center mock data
const helpCenterData = {
    categories: [
        {
            title: 'FAQs',
            icon: 'fas fa-question-circle',
            description: 'Find answers to common questions',
            link: '/faqs'
        },
        {
            title: 'Contact Support',
            icon: 'fas fa-headset',
            description: 'Get help from our support team',
            link: '/contact'
        },
        {
            title: 'Tutorials',
            icon: 'fas fa-book-open',
            description: 'Learn how to use our services',
            link: '/tutorials'
        },
        {
            title: 'Community Guidelines',
            icon: 'fas fa-users',
            description: 'Understanding our community rules',
            link: '/guidelines'
        }
    ],
    gettingStarted: [
        { title: 'Creating your account', link: '/help/create-account' },
        { title: 'Updating profile', link: '/help/update-profile' },
        { title: 'Reset password', link: '/help/reset-password' }
    ],
    commonIssues: [
        { title: 'Login problems', link: '/help/login-issues' },
        { title: 'Payment issues', link: '/help/payment-issues' },
        { title: 'Access denied', link: '/help/access-issues' }
    ]
};

// Language selection mock data
const languages = [
    { code: 'en', englishName: 'English', nativeName: 'English', icon: 'fas fa-flag-usa' },
    { code: 'ar', englishName: 'Arabic', nativeName: 'العربية', icon: 'fas fa-mosque' },
    { code: 'es', englishName: 'Spanish', nativeName: 'Español', icon: 'fas fa-sun' },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', icon: 'fas fa-flag' }
];

// Middleware to set language
app.use((req, res, next) => {
    const langCode = req.cookies.language || 'en';
    try {
        const translations = require(`./locales/${langCode}.json`);
        res.locals.translations = translations;
    } catch (error) {
        console.error(`Missing translation file for language: ${langCode}. Falling back to English.`);
        res.locals.translations = require('./locales/en.json');
    }
    res.locals.languages = languages;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: res.locals.translations.title
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

// Add dashboard route
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        user: mockData.user,
        locations: mockData.locations,
        jobs: mockData.jobs,
        housing: mockData.housing,
        healthcare: mockData.healthcare
    });
});

// Add property route
app.get('/property/:id', (req, res) => {
    res.render('property', {
        property: mockProperty,
        similarProperties: [
            { id: 2, title: 'Studio Apartment', price: '$800/month', photo: 'https://via.placeholder.com/300x200' },
            { id: 3, title: 'Shared Room', price: '$400/month', photo: 'https://via.placeholder.com/300x200' },
            { id: 4, title: 'Family Home', price: '$1,500/month', photo: 'https://via.placeholder.com/300x200' }
        ]
    });
});

// Add account settings route
app.get('/settings', (req, res) => {
    res.render('accountSettings', {
        user: {
            name: 'Kasim Lohar',
            firstName: 'Kasim',
            lastName: 'Lohar',
            email: 'Kasimlohar@gmail.com',
            phone: '+1234567900',
            avatar: 'https://via.placeholder.com/32'
        }
    });
});

// Handle settings update
app.post('/settings', (req, res) => {
    // TODO: Handle settings update
    res.json({ success: true });
});

// Add help center route
app.get('/help', (req, res) => {
    res.render('helpCenter', {
        title: 'Help Center',
        ...helpCenterData
    });
});

// Add language selection route
app.get('/language', (req, res) => {
    res.render('languageSelection', {
        title: 'Choose Language'
    });
});

// Handle language selection
app.get('/set-language/:code', (req, res) => {
    const langCode = req.params.code;
    if (languages.some(lang => lang.code === langCode)) {
        res.cookie('language', langCode, { maxAge: 900000, httpOnly: true });
    }
    res.redirect(req.get('referer') || '/');
});

// Handle support form submission
app.post('/api/support', (req, res) => {
    // TODO: Handle support form submission
    res.json({ success: true });
});

// User Registration
app.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// User Logout
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logout successful' });
});

// Password Reset
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ success: false, message: 'Password reset failed' });
    }
});

// Protected Route Example (Role-Based Access Control)
app.get('/admin', authMiddleware(['admin']), (req, res) => {
    res.json({ success: true, message: 'Welcome, Admin!' });
});

// Use chatbot routes
app.use('/', chatbotRoutes);

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
    console.log(`Server running on port ${PORT}`);
});
