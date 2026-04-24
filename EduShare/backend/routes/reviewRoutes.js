const express = require('express');
const router = express.Router();
const { addReview, getResourceReviews, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:resourceId', getResourceReviews);
router.post('/:resourceId', protect, addReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;