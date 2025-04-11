const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Healthcare = require('../models/Healthcare');

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

// Seed healthcare data
const seedHealthcare = async () => {
    try {
        // Clear existing healthcare data
        await Healthcare.deleteMany();
        console.log('Existing healthcare data cleared.');

        // Healthcare data
        const healthcare = [
            {
                name: 'Refugee Health Initiative Clinic',
                type: 'NGO Clinic',
                location: 'Chandni Chowk, Delhi',
                createdAt: '2024-10-15T08:00:00Z'
            },
            {
                name: 'Government General Hospital',
                type: 'Public Hospital',
                location: 'Anna Salai, Chennai',
                createdAt: '2024-11-20T09:30:00Z'
            },
            {
                name: 'Care & Cure Community Clinic',
                type: 'Community Clinic',
                location: 'Santacruz, Mumbai',
                createdAt: '2025-01-10T11:15:00Z'
            },
            {
                name: 'Médecins Sans Frontières Mobile Clinic',
                type: 'Mobile Medical Unit',
                location: 'Various locations in Kolkata',
                createdAt: '2025-02-05T10:00:00Z'
            },
            {
                name: 'Primary Health Center',
                type: 'Government Clinic',
                location: 'Madhapur, Hyderabad',
                createdAt: '2024-12-12T09:45:00Z'
            }
        ];

        // Insert healthcare data into the database
        await Healthcare.insertMany(healthcare);
        console.log('Healthcare data seeded successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding healthcare data:', err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedHealthcare();
})();
