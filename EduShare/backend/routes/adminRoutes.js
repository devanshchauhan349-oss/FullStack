const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStats, getAllResources, deleteResource } = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/resources', getAllResources);
router.delete('/resource/:id', deleteResource);

module.exports = router;