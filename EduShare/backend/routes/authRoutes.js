const express = require('express');
const router = express.Router();
const { register, login, getMe, addBookmark, getBookmarks } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/bookmarks/:resourceId', protect, addBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;