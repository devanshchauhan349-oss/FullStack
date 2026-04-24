const express = require('express');
const router = express.Router();
const {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    downloadResource,
    getUserResources,
    searchResources
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getResources);
router.get('/search', searchResources);
router.get('/:id', getResourceById);

// Protected routes
router.get('/my-resources', protect, getUserResources);
router.post('/', protect, authorize('contributor', 'admin'), upload.single('file'), createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/download', protect, downloadResource);

module.exports = router;