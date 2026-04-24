const Resource = require('../models/Resource');
const User = require('../models/User');

exports.getStats = async (req, res) => {
    try {
        const totalResources = await Resource.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalDownloads = await Resource.aggregate([
            { $group: { _id: null, total: { $sum: '$downloads' } } }
        ]);
        
        res.json({
            totalResources,
            totalUsers,
            totalDownloads: totalDownloads[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};