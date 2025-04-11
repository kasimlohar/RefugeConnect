const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Housing = require('../models/Housing');

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

// Seed housing data
const seedHousing = async () => {
    try {
        // Clear existing housing data
        await Housing.deleteMany();
        console.log('Existing housing data cleared.');

        // Housing data
        const housing = [
            {
                type: 'Shared Room',
                price: 5000,
                location: 'Lajpat Nagar, Delhi',
                size: '100 sq ft',
                createdAt: '2025-03-18T09:30:00Z'
            },
            {
                type: '1BHK Apartment',
                price: 12000,
                location: 'Andheri East, Mumbai',
                size: '450 sq ft',
                createdAt: '2025-03-10T11:15:00Z'
            },
            {
                type: 'Hostel',
                price: 3500,
                location: 'Koramangala, Bengaluru',
                size: '80 sq ft per bed',
                createdAt: '2025-02-25T14:45:00Z'
            },
            {
                type: '2BHK Flat',
                price: 15000,
                location: 'Salt Lake, Kolkata',
                size: '700 sq ft',
                createdAt: '2025-03-05T08:20:00Z'
            },
            {
                type: 'NGO Shelter',
                price: 0,
                location: 'Ayanavaram, Chennai',
                size: 'Community hall',
                createdAt: '2025-03-15T10:00:00Z'
            }
        ];

        // Insert housing data into the database
        await Housing.insertMany(housing);
        console.log('Housing data seeded successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding housing data:', err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedHousing();
})();
