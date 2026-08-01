const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// Base route: /api/projects
router.route('/')
    .get(getProjects) // Public: Anyone can view projects
    .post(protect, upload.single('image'), createProject); // Private: Only Admin can create

// Route: /api/projects/:id
router.route('/:id')
    .delete(protect, deleteProject); // Private: Only Admin can delete

module.exports = router;