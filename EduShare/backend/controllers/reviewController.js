const Review = require('../models/Review');
const Resource = require('../models/Resource');

// @desc    Add review
// @route   POST /api/reviews/:resourceId
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const resourceId = req.params.resourceId;
        
        const existing = await Review.findOne({ resource: resourceId, user: req.user.id });
        if (existing) {
            return res.status(400).json({ message: 'You already reviewed this resource' });
        }
        
        const review = await Review.create({
            resource: resourceId,
            user: req.user.id,
            rating,
            comment
        });
        
        const reviews = await Review.find({ resource: resourceId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await Resource.findByIdAndUpdate(resourceId, { avgRating });
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get resource reviews
// @route   GET /api/reviews/:resourceId
exports.getResourceReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ resource: req.params.resourceId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};