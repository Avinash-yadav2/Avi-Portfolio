const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Base route: /api/contact
router.route('/')
    .post(sendMessage) // Public: Anyone can send you a message
    .get(protect, getMessages); // Private: Only Admin can read messages

module.exports = router;