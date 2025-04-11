const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

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

// Seed user data
const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany();
        console.log('Existing users cleared.');

        // User data
        const users = [
            {
                name: 'Raj Sharma',
                email: 'raj.sharma@email.com',
                password: '$2a$10$xJwT4B0XO9fIUZ7hT6vYZ.3LVoKn1UbC/9FG5kHhZCl3Y5Sje2eEm',
                role: 'user',
                createdAt: '2024-12-15T08:30:00Z'
            },
            {
                name: 'Priya Patel',
                email: 'priya.patel@email.com',
                password: '$2a$10$7HmXYu2tPJx5vw9QVz/8.uRxzL.3W0D1fFJiVxTGftaVL8.FLnRsC',
                role: 'admin',
                createdAt: '2024-11-20T10:15:00Z'
            },
            {
                name: 'Mohammed Khan',
                email: 'mohammed.khan@email.com',
                password: '$2a$10$nK.3Yzb9D2h5u8Xq1JZ3Z.4mX9XeZ9mZ3W6D7hZ.5zJZ5G5vZ5JzC',
                role: 'user',
                createdAt: '2025-01-05T14:45:00Z'
            },
            {
                name: 'Anjali Gupta',
                email: 'anjali.gupta@email.com',
                password: '$2a$10$pL3h5zJ5rD8v9Z9Z5Z9Z5.jZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
                role: 'user',
                createdAt: '2024-10-28T09:20:00Z'
            },
            {
                name: 'Sanjay Reddy',
                email: 'sanjay.reddy@email.com',
                password: '$2a$10$qW3h5zJ5rD8v9Z9Z5Z9Z5.jZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
                role: 'admin',
                createdAt: '2025-02-10T11:30:00Z'
            }
        ];

        // Insert users into the database
        await User.insertMany(users);
        console.log('Users seeded successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedUsers();
})();
