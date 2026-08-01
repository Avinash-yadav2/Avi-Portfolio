// controllers/profileController.js
const Profile = require('../models/Profile');
const uploadToCloudinary = require('../utils/cloudinaryUpload');

// ==========================================
// MAIN PROFILE CONTROLLERS
// ==========================================

// @desc    Get Profile Data
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res, next) => {
    try {
        let profile = await Profile.findOne();
        
        // Auto-seed database if empty
        if (!profile) {
            profile = await Profile.create({
                name: 'Avinash Yadav',
                bio: 'I am a Full Stack MERN Developer driven by logic, problem solving, and clean system design.',
                roles: ['Full Stack Developer', 'MERN Stack Expert'],
                socials: { email: 'yadavaviii847@gmail.com' },
                location: 'Varanasi, India'
            });
        }
        
        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};

// @desc    Update Base Profile Data
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        let profile = await Profile.findOne();
        
        const updateData = { ...req.body };
        
        // Parse JSON fields safely if they come as strings from FormData
        if (req.body.roles) updateData.roles = JSON.parse(req.body.roles);
        if (req.body.socials) updateData.socials = JSON.parse(req.body.socials);

        // Handle File Uploads to Cloudinary
        if (req.files) {
            if (req.files.profileImage) {
                updateData.profileImage = await uploadToCloudinary(req.files.profileImage[0], 'portfolio/profile');
            }
            if (req.files.resume) {
                updateData.resume = await uploadToCloudinary(req.files.resume[0], 'portfolio/resume');
            }
        }

        if (!profile) {
            profile = await Profile.create(updateData);
        } else {
            profile = await Profile.findByIdAndUpdate(profile._id, updateData, { 
                new: true, 
                runValidators: true 
            });
        }

        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};

// ==========================================
// EXPERIENCE CRUD
// ==========================================

exports.addExperience = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.experience.unshift(req.body); // Add to the top of the list
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};

exports.deleteExperience = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};

// ==========================================
// EDUCATION CRUD
// ==========================================

exports.addEducation = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.education.unshift(req.body);
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};

exports.deleteEducation = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.education = profile.education.filter(edu => edu._id.toString() !== req.params.edu_id);
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};

// ==========================================
// TECH STACK CRUD
// ==========================================

exports.addTechStack = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.techStack.push(req.body); // Add to the end of the list
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};

exports.deleteTechStack = async (req, res, next) => {
    try {
        const profile = await Profile.findOne();
        profile.techStack = profile.techStack.filter(tech => tech._id.toString() !== req.params.tech_id);
        await profile.save();
        res.status(200).json(profile);
    } catch (error) { 
        next(error); 
    }
};