// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile,
    addExperience, deleteExperience,
    addEducation, deleteEducation,
    addTechStack, deleteTechStack
} = require('../controllers/profileController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// Base Profile Routes (Text Data & Files)
router.route('/')
    .get(getProfile)
    .put(
        protect, 
        upload.fields([
            { name: 'profileImage', maxCount: 1 },
            { name: 'resume', maxCount: 1 }
        ]), 
        updateProfile
    );

// Experience Routes
router.post('/experience', protect, addExperience);
router.delete('/experience/:exp_id', protect, deleteExperience);

// Education Routes
router.post('/education', protect, addEducation);
router.delete('/education/:edu_id', protect, deleteEducation);

// Tech Stack Routes
router.post('/tech', protect, addTechStack);
router.delete('/tech/:tech_id', protect, deleteTechStack);

module.exports = router;