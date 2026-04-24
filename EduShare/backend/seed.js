const mongoose = require('mongoose');
const User = require('./models/User');
const Resource = require('./models/Resource');
require('dotenv').config();

const sampleResources = [
    {
        title: "Complete JavaScript Guide 2024",
        description: "A comprehensive guide to JavaScript covering ES6 to ES2024 features.",
        type: "pdf",
        subject: "Computer Science",
        topic: "JavaScript",
        tags: ["javascript", "programming", "web development"],
        courseYear: "2nd",
        status: "approved",
        downloads: 1250,
        views: 3400,
        avgRating: 4.8
    },
    {
        title: "Data Structures and Algorithms",
        description: "Learn essential data structures and algorithms with practical examples.",
        type: "video",
        subject: "Computer Science",
        topic: "Data Structures",
        tags: ["algorithms", "data structures"],
        courseYear: "2nd",
        status: "approved",
        downloads: 890,
        views: 2100,
        avgRating: 4.9
    },
    {
        title: "Calculus I - Complete Notes",
        description: "Detailed notes covering limits, derivatives, and integrals.",
        type: "notes",
        subject: "Mathematics",
        topic: "Calculus",
        tags: ["calculus", "mathematics"],
        courseYear: "1st",
        status: "approved",
        downloads: 3420,
        views: 8900,
        avgRating: 4.7
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/edushare');
        console.log('Connected to MongoDB');

        await Resource.deleteMany({});
        console.log('Cleared existing resources');

        // Create admin user
        let user = await User.findOne({ email: 'admin@edushare.com' });
        if (!user) {
            user = await User.create({
                name: 'Admin User',
                email: 'admin@edushare.com',
                password: '123456',
                role: 'admin'
            });
            console.log('Created admin user');
        }

        // Add user ID to resources
        const resourcesWithUser = sampleResources.map(r => ({
            ...r,
            uploadedBy: user._id
        }));

        await Resource.insertMany(resourcesWithUser);
        console.log(`✅ Added ${sampleResources.length} sample resources`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedDatabase();