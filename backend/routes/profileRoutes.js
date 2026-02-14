const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Profile = require('../models/Profile');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_profile',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf']
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    const { 
        name, bio, roles, 
        linkedin, github, twitter, instagram, email,
        experience, education, techStack 
    } = req.body;

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    if (name) profile.name = name;
    if (bio) profile.bio = bio;
    
    if (roles) {
       profile.roles = typeof roles === 'string' ? roles.split(',').map(r => r.trim()) : roles;
    }

    profile.socials = {
      linkedin: linkedin || profile.socials?.linkedin || "",
      github: github || profile.socials?.github || "",
      twitter: twitter || profile.socials?.twitter || "",
      instagram: instagram || profile.socials?.instagram || "",
      email: email || profile.socials?.email || "",
    };

    if (experience) {
        try { profile.experience = JSON.parse(experience); } catch(e) { console.error("Exp Parse Error", e); }
    }
    if (education) {
        try { profile.education = JSON.parse(education); } catch(e) { console.error("Edu Parse Error", e); }
    }
    if (techStack) {
        try { profile.techStack = JSON.parse(techStack); } catch(e) { console.error("Tech Parse Error", e); }
    }

    if (req.files['profileImage']) {
      profile.profileImage = req.files['profileImage'][0].path;
    }
    if (req.files['resume']) {
      profile.resume = req.files['resume'][0].path;
    }

    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;