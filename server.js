const express = require('express');
const path = require('path');
const chatbotRoutes = require('./routes/chatbotRoutes');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.config');
const User = require('./models/User');
const Job = require('./models/Job');
const Housing = require('./models/Housing');
const Healthcare = require('./models/Healthcare');
const Conversation = require('./models/Conversation');
const app = express();

// Connect to MongoDB
connectDB();

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
        title: res.locals.translations.title,
        translations: res.locals.translations, // Pass translations explicitly
        activePage: 'home', // Define activePage for the home route
        seoDescription: 'Empowering refugees with tools and resources for a better future.',
        seoKeywords: 'refugees, support, housing, jobs, education, healthcare',
        heroTitle: 'Empowering Refugees Through AI Support',
        heroSubtitle: 'Your trusted companion for a smoother transition into your new community.',
        heroImage: '/images/welcome-illustration.jpeg', // Define heroImage
        getStartedLink: '/get-started',
        learnMoreLink: '/learn-more',
        featuresTitle: 'Why Choose RefugeConnect?',
        featuresSubtitle: 'We provide tools and resources to help you integrate seamlessly.',
        features: [
            { icon: 'fas fa-shield-alt', title: 'Safe & Secure', description: 'Your data is protected with top-notch security measures.' },
            { icon: 'fas fa-users', title: 'Community Support', description: 'Connect with a supportive community to ease your transition.' },
            { icon: 'fas fa-language', title: 'Multi-language', description: 'Access resources in your preferred language for better understanding.' },
            { icon: 'fas fa-robot', title: 'AI Assistance', description: 'Get instant help from our AI-powered assistant anytime.' }
        ],
        howWeHelpTitle: 'How We Help You',
        howWeHelpSubtitle: 'Explore our key services designed to support your journey.',
        services: [
            { icon: 'fas fa-home', title: 'Housing Assistance', description: 'Find safe and affordable housing options in your new community.', link: '/housing' },
            { icon: 'fas fa-briefcase', title: 'Job Search', description: 'Connect with employers and find employment opportunities.', link: '/jobs' },
            { icon: 'fas fa-graduation-cap', title: 'Education Access', description: 'Access educational resources and learning opportunities.', link: '/education' }
        ]
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About - RefugeConnect',
        activePage: 'about' // Define activePage for the about route
    });
});

app.get('/services', (req, res) => {
    res.render('services', { 
        title: 'Services - RefugeConnect',
        activePage: 'services' // Define activePage for the services route
    });
});

app.get('/help', (req, res) => {
    res.render('helpCenter', { 
        title: 'Help Center - RefugeConnect',
        activePage: 'help', // Define activePage for the help route
        ...helpCenterData
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
        title: 'Sign Up - RefugeConnect',
        activePage: 'signup', // Define activePage for the signup route
        errorMessage: null // Pass errorMessage as null initially
    });
});

// Add signup POST handler
app.post('/signup', async (req, res) => {
    const { fullName, emailPhone, password } = req.body;

    try {
        // Perform server-side validation
        if (!fullName || !emailPhone || !password) {
            return res.render('signup', {
                title: 'Sign Up - RefugeConnect',
                activePage: 'signup',
                errorMessage: 'All fields are required.'
            });
        }

        // Check for duplicate accounts (mock implementation)
        const existingUser = await User.findOne({ email: emailPhone });
        if (existingUser) {
            return res.render('signup', {
                title: 'Sign Up - RefugeConnect',
                activePage: 'signup',
                errorMessage: 'An account with this email or phone already exists.'
            });
        }

        // Create new user (mock implementation)
        const newUser = new User({ fullName, email: emailPhone, password });
        await newUser.save();

        // Redirect to login page after successful signup
        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup:', error.message || error);
        res.render('signup', {
            title: 'Sign Up - RefugeConnect',
            activePage: 'signup',
            errorMessage: 'An unexpected error occurred. Please try again later.'
        });
    }
});

// Add dashboard route
app.get('/dashboard', async (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get search query from request
        const filter = req.query.filter || ''; // Get filter from request
        const currentPage = parseInt(req.query.page) || 1; // Get current page from request
        const itemsPerPage = 6; // Define the number of items per page

        // Fetch data based on filter (mock implementation)
        const allJobs = filter === 'jobs' || filter === '' ? await Job.find() : [];
        const allHousing = filter === 'housing' || filter === '' ? await Housing.find() : [];
        const allHealthcare = filter === 'healthcare' || filter === '' ? await Healthcare.find() : [];

        // Paginate data
        const jobs = allJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        const housing = allHousing.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        const healthcare = allHealthcare.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        // Calculate total pages
        const jobPages = Math.ceil(allJobs.length / itemsPerPage);
        const housingPages = Math.ceil(allHousing.length / itemsPerPage);
        const healthcarePages = Math.ceil(allHealthcare.length / itemsPerPage);

        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user || { name: 'Guest', avatar: '/images/default-avatar.png' },
            jobs,
            housing,
            healthcare,
            searchQuery, // Pass searchQuery to the template
            filter, // Pass filter to the template
            currentPage, // Pass currentPage to the template
            jobPages, // Pass jobPages to the template
            housingPages, // Pass housingPages to the template
            healthcarePages, // Pass healthcarePages to the template
            activePage: 'dashboard' // Define activePage for the dashboard route
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add property route
app.get('/property/:id', (req, res) => {
    res.render('property', {
        property: mockProperty,
        similarProperties: [
            { id: 2, title: 'Studio Apartment', price: '$800/month', photo: 'https://via.placeholder.com/300x200' },
            { id: 3, title: 'Shared Room', price: '$400/month', photo: 'https://via.placeholder.com/300x200' },
            { id: 4, title: 'Family Home', price: '$1,500/month', photo: 'https://via.placeholder.com/300x200' }
        ],
        activePage: 'property' // Define activePage for the property route
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
        },
        activePage: 'settings', // Define activePage for the account settings route
        errorMessage: null // Pass errorMessage as null initially
    });
});

// Handle settings update
app.post('/settings', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // Perform server-side validation
        if (!firstName || !lastName || !email || !phone) {
            return res.render('accountSettings', {
                user: req.body, // Pass the submitted data back to the form
                activePage: 'settings',
                errorMessage: 'All fields are required.'
            });
        }

        // Mock update logic (replace with actual database update logic)
        console.log('User settings updated:', { firstName, lastName, email, phone });

        // Redirect to the settings page with a success message
        res.redirect('/settings');
    } catch (error) {
        console.error('Error updating settings:', error.message || error);
        res.render('accountSettings', {
            user: req.body, // Pass the submitted data back to the form
            activePage: 'settings',
            errorMessage: 'An unexpected error occurred. Please try again later.'
        });
    }
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
        title: 'Choose Language',
        activePage: 'language' // Define activePage for the language selection route
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

// API route to fetch available languages
app.get('/api/languages', (req, res) => {
    try {
        res.json(languages); // Send the list of languages as JSON
    } catch (error) {
        console.error('Error fetching languages:', error.message || error);
        res.status(500).json({ error: 'Failed to load languages. Please try again later.' });
    }
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
        title: 'Page Not Found',
        translations: res.locals.translations // Pass translations explicitly
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error',
        error: err,
        translations: res.locals.translations // Pass translations explicitly
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
