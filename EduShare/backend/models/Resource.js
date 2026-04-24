const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    type: {
        type: String,
        enum: ['pdf', 'video', 'notes', 'link'],
        required: true
    },
    fileUrl: {
        type: String
    },
    externalLink: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    tags: [String],
    courseYear: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    avgRating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ subject: 1, createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);