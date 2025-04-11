const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');

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

// Seed job data
const seedJobs = async () => {
    try {
        // Clear existing jobs
        await Job.deleteMany();
        console.log('Existing jobs cleared.');

        // Job data
        const jobs = [
            {
                title: 'Call Center Representative',
                company: 'TechSupport Solutions',
                location: 'Bengaluru, Karnataka',
                createdAt: '2025-03-10T09:00:00Z'
            },
            {
                title: 'Construction Worker',
                company: 'Delhi Infrastructure Ltd',
                location: 'Delhi, NCR',
                createdAt: '2025-03-15T11:30:00Z'
            },
            {
                title: 'Housekeeping Staff',
                company: 'Hyatt Regency',
                location: 'Mumbai, Maharashtra',
                createdAt: '2025-02-28T14:15:00Z'
            },
            {
                title: 'Textile Worker',
                company: 'Surat Fabrics',
                location: 'Surat, Gujarat',
                createdAt: '2025-03-05T10:45:00Z'
            },
            {
                title: 'Kitchen Helper',
                company: 'Taj Hotels',
                location: 'Chennai, Tamil Nadu',
                createdAt: '2025-03-12T08:30:00Z'
            }
        ];

        // Insert jobs into the database
        await Job.insertMany(jobs);
        console.log('Jobs seeded successfully.');
        process.exit();
    } catch (err) {
        console.error('Error seeding jobs:', err);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedJobs();
})();
