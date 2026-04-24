const Resource = require('../models/Resource');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');

// @desc    Get all resources with filters
// @route   GET /api/resources
exports.getResources = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        let filter = { status: 'approved' };
        
        if (req.query.search && req.query.search.trim()) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.search, 'i')] } }
            ];
        }
        
        if (req.query.subject && req.query.subject !== '') {
            filter.subject = req.query.subject;
        }
        
        if (req.query.type && req.query.type !== '') {
            filter.type = req.query.type;
        }
        
        const total = await Resource.countDocuments(filter);
        const resources = await Resource.find(filter)
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        res.json({
            success: true,
            resources,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Error in getResources:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('uploadedBy', 'name email');
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        
        resource.views += 1;
        await resource.save();
        
        const reviews = await Review.find({ resource: resource._id }).populate('user', 'name');
        
        res.json({ ...resource.toObject(), reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create resource
// @route   POST /api/resources
exports.createResource = async (req, res) => {
    try {
        const resourceData = {
            ...req.body,
            tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
            uploadedBy: req.user.id
        };
        
        if (req.file) {
            resourceData.fileUrl = `/uploads/${req.file.filename}`;
        }
        
        if (req.body.type === 'link' && req.body.externalLink) {
            resourceData.externalLink = req.body.externalLink;
        }
        
        const resource = await Resource.create(resourceData);
        
        res.status(201).json({
            success: true,
            message: 'Resource created successfully',
            resource
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
exports.updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        
        if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.json({ success: true, resource: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        
        if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (resource.fileUrl) {
            const filePath = path.join(__dirname, '..', resource.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await resource.deleteOne();
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Increment download count
// @route   POST /api/resources/:id/download
exports.downloadResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (resource) {
            resource.downloads += 1;
            await resource.save();
            res.json({ success: true, downloads: resource.downloads });
        } else {
            res.status(404).json({ success: false, message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's resources
// @route   GET /api/resources/my-resources
exports.getUserResources = async (req, res) => {
    try {
        const resources = await Resource.find({ uploadedBy: req.user.id })
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search resources
// @route   GET /api/resources/search
exports.searchResources = async (req, res) => {
    try {
        const { q } = req.query;
        const resources = await Resource.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ],
            status: 'approved'
        }).populate('uploadedBy', 'name email').limit(20);
        
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};