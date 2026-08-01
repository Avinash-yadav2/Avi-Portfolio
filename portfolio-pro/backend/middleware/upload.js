// middleware/upload.js
const multer = require('multer');

// Store in memory (RAM) instead of disk for extreme speed and serverless compatibility
const storage = multer.memoryStorage();

// Limit file size to 5MB to prevent abuse
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;