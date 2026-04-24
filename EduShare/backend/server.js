const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Create a sample PDF file for testing
const samplePdfPath = path.join(uploadDir, 'sample-javascript-guide.pdf');
if (!fs.existsSync(samplePdfPath)) {
    const sampleContent = `JavaScript Guide - Sample Content
    
Chapter 1: Introduction to JavaScript
JavaScript is a programming language that is one of the core technologies of the World Wide Web.

Chapter 2: Variables and Data Types
JavaScript variables can hold many data types: numbers, strings, objects, arrays, functions, and more.

Chapter 3: Functions
Functions are one of the fundamental building blocks in JavaScript.

This is a sample PDF file for testing the download functionality in EduShare.
Download this file to test that your download is working properly!`;
    
    fs.writeFileSync(samplePdfPath, sampleContent);
    console.log('✅ Created sample PDF file for testing');
}

// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// In-memory storage (for development)
// For production, use MongoDB
let users = [];
let resources = [];
let reviews = [];
let nextId = { user: 4, resource: 6, review: 1 };

// Create demo users
const adminPassword = bcrypt.hashSync('123456', 10);
const contributorPassword = bcrypt.hashSync('123456', 10);
const studentPassword = bcrypt.hashSync('123456', 10);

users.push({
    id: 1,
    name: 'Admin User',
    email: 'admin@edushare.com',
    password: adminPassword,
    role: 'admin',
    createdAt: new Date()
});

users.push({
    id: 2,
    name: 'Test Contributor',
    email: 'contributor@test.com',
    password: contributorPassword,
    role: 'contributor',
    createdAt: new Date()
});

users.push({
    id: 3,
    name: 'Test Student',
    email: 'student@test.com',
    password: studentPassword,
    role: 'student',
    createdAt: new Date()
});

// Create sample resources
resources.push(
    {
        id: 1,
        title: 'Complete JavaScript Guide 2024',
        description: 'A comprehensive guide to JavaScript covering ES6 to ES2024 features, async programming, and modern development practices.',
        type: 'pdf',
        subject: 'Computer Science',
        topic: 'JavaScript',
        tags: ['javascript', 'programming', 'web-dev'],
        courseYear: '2nd',
        uploadedBy: 1,
        uploaderName: 'Admin User',
        downloads: 1250,
        views: 3400,
        avgRating: 4.8,
        status: 'approved',
        fileUrl: '/uploads/sample-javascript-guide.pdf',
        externalLink: null,
        createdAt: new Date()
    },
    {
        id: 2,
        title: 'Data Structures and Algorithms',
        description: 'Learn essential data structures and algorithms with practical examples for coding interviews.',
        type: 'video',
        subject: 'Computer Science',
        topic: 'Algorithms',
        tags: ['algorithms', 'datastructures', 'interviews'],
        courseYear: '2nd',
        uploadedBy: 1,
        uploaderName: 'Admin User',
        downloads: 890,
        views: 2100,
        avgRating: 4.9,
        status: 'approved',
        fileUrl: null,
        externalLink: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
        createdAt: new Date()
    },
    {
        id: 3,
        title: 'Calculus I - Complete Notes',
        description: 'Detailed notes covering limits, derivatives, integrals, and their applications.',
        type: 'notes',
        subject: 'Mathematics',
        topic: 'Calculus',
        tags: ['calculus', 'math', 'derivatives'],
        courseYear: '1st',
        uploadedBy: 1,
        uploaderName: 'Admin User',
        downloads: 3420,
        views: 8900,
        avgRating: 4.7,
        status: 'approved',
        fileUrl: '/uploads/sample-javascript-guide.pdf',
        externalLink: null,
        createdAt: new Date()
    },
    {
        id: 4,
        title: 'Physics for Engineers',
        description: 'Complete physics course covering mechanics, thermodynamics, and electromagnetism.',
        type: 'pdf',
        subject: 'Physics',
        topic: 'Mechanics',
        tags: ['physics', 'engineering', 'mechanics'],
        courseYear: '1st',
        uploadedBy: 1,
        uploaderName: 'Admin User',
        downloads: 2100,
        views: 5600,
        avgRating: 4.6,
        status: 'approved',
        fileUrl: '/uploads/sample-javascript-guide.pdf',
        externalLink: null,
        createdAt: new Date()
    },
    {
        id: 5,
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning concepts, algorithms, and Python implementation.',
        type: 'video',
        subject: 'Computer Science',
        topic: 'Machine Learning',
        tags: ['machinelearning', 'ai', 'python'],
        courseYear: '3rd',
        uploadedBy: 1,
        uploaderName: 'Admin User',
        downloads: 1560,
        views: 4200,
        avgRating: 4.8,
        status: 'approved',
        fileUrl: null,
        externalLink: 'https://www.coursera.org/learn/machine-learning',
        createdAt: new Date()
    }
);

const JWT_SECRET = process.env.JWT_SECRET || 'edushare_secret_key_2024';

// Auth Middleware
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: nextId.user++,
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            createdAt: new Date()
        };
        users.push(newUser);
        
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/auth/me', protect, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

// ============ RESOURCE ROUTES ============
app.get('/api/resources', (req, res) => {
    let filtered = resources.filter(r => r.status === 'approved');
    
    if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filtered = filtered.filter(r => 
            r.title.toLowerCase().includes(search) || 
            r.description.toLowerCase().includes(search) ||
            r.tags.some(t => t.toLowerCase().includes(search))
        );
    }
    if (req.query.subject && req.query.subject !== 'all') {
        filtered = filtered.filter(r => r.subject === req.query.subject);
    }
    if (req.query.type && req.query.type !== 'all') {
        filtered = filtered.filter(r => r.type === req.query.type);
    }
    
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ resources: filtered, total: filtered.length });
});

app.get('/api/resources/:id', (req, res) => {
    const resource = resources.find(r => r.id === parseInt(req.params.id));
    if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    resource.views += 1;
    const resourceReviews = reviews.filter(r => r.resourceId === resource.id);
    res.json({ ...resource, reviews: resourceReviews });
});

// UPLOAD RESOURCE
app.post('/api/resources', protect, upload.single('file'), (req, res) => {
    try {
        const { title, description, type, subject, topic, tags, courseYear, externalLink } = req.body;
        
        const newResource = {
            id: nextId.resource++,
            title,
            description,
            type,
            subject,
            topic: topic || '',
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            courseYear: courseYear || '1st',
            uploadedBy: req.user.id,
            uploaderName: req.user.name,
            downloads: 0,
            views: 0,
            avgRating: 0,
            status: 'approved',
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
            externalLink: type === 'link' ? (externalLink || null) : null,
            createdAt: new Date()
        };
        
        resources.push(newResource);
        
        res.status(201).json({
            success: true,
            message: 'Resource uploaded successfully!',
            resource: newResource
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DOWNLOAD ROUTE - Increment counter
app.post('/api/resources/:id/download', protect, (req, res) => {
    const resourceId = parseInt(req.params.id);
    const resource = resources.find(r => r.id === resourceId);
    
    if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    
    resource.downloads += 1;
    
    res.json({ 
        success: true, 
        downloads: resource.downloads,
        fileUrl: resource.fileUrl,
        externalLink: resource.externalLink,
        type: resource.type
    });
});

// ACTUAL FILE DOWNLOAD ENDPOINT
app.get('/api/download/:id', protect, (req, res) => {
    const resourceId = parseInt(req.params.id);
    const resource = resources.find(r => r.id === resourceId);
    
    if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    
    if (resource.fileUrl) {
        const filePath = path.join(__dirname, resource.fileUrl);
        if (fs.existsSync(filePath)) {
            const fileName = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/pdf');
            
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }
    } else if (resource.externalLink) {
        res.json({ externalLink: resource.externalLink, type: 'redirect' });
    } else {
        res.status(404).json({ message: 'No downloadable content' });
    }
});

app.delete('/api/resources/:id', protect, (req, res) => {
    const index = resources.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    if (resources[index].uploadedBy !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    resources.splice(index, 1);
    res.json({ success: true });
});

app.get('/api/resources/my-resources', protect, (req, res) => {
    const userResources = resources.filter(r => r.uploadedBy === req.user.id);
    res.json(userResources);
});

// ============ REVIEW ROUTES ============
app.post('/api/reviews/:resourceId', protect, (req, res) => {
    const resourceId = parseInt(req.params.resourceId);
    const { rating, comment } = req.body;
    
    const existing = reviews.find(r => r.resourceId === resourceId && r.userId === req.user.id);
    if (existing) {
        return res.status(400).json({ message: 'Already reviewed' });
    }
    
    const newReview = {
        id: nextId.review++,
        resourceId,
        userId: req.user.id,
        userName: req.user.name,
        rating: parseInt(rating),
        comment,
        createdAt: new Date()
    };
    reviews.push(newReview);
    
    const resourceReviews = reviews.filter(r => r.resourceId === resourceId);
    const avgRating = resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length;
    const resource = resources.find(r => r.id === resourceId);
    if (resource) resource.avgRating = avgRating;
    
    res.status(201).json({ success: true, review: newReview });
});

app.get('/api/reviews/:resourceId', (req, res) => {
    const resourceReviews = reviews.filter(r => r.resourceId === parseInt(req.params.resourceId));
    res.json(resourceReviews);
});

// ============ ADMIN ROUTES ============
app.get('/api/admin/stats', protect, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    res.json({
        totalResources: resources.length,
        totalUsers: users.length,
        totalDownloads: resources.reduce((s, r) => s + r.downloads, 0),
        totalReviews: reviews.length
    });
});

app.get('/api/admin/resources', protect, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    res.json(resources);
});

app.delete('/api/admin/resources/:id', protect, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const index = resources.findIndex(r => r.id === parseInt(req.params.id));
    if (index !== -1) resources.splice(index, 1);
    res.json({ success: true });
});

// ============ UTILITY ============
app.get('/api/subjects', (req, res) => {
    const subjects = [...new Set(resources.map(r => r.subject))];
    res.json(subjects);
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'EduShare Backend is running!',
        resources: resources.length,
        users: users.length,
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============ ROOT ROUTE ============
app.get('/', (req, res) => {
    res.json({
        name: 'EduShare API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            resources: '/api/resources',
            reviews: '/api/reviews',
            admin: '/api/admin'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});


// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ EduShare Backend Running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📝 Test: http://localhost:${PORT}/api/test`);
    console.log(`\n👤 Demo Accounts:`);
    console.log(`   Admin: admin@edushare.com / 123456`);
    console.log(`   Contributor: contributor@test.com / 123456`);
    console.log(`   Student: student@test.com / 123456`);
});
app.use(cors()); // This allows any website to call your API