const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');

//MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'profileImage', maxCount: 1 }, 
  { name: 'resume', maxCount: 1 }
]);

//GET PROFILE
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

//UPDATE PROFILE
router.post('/', upload, async (req, res) => {
  try {
    const { 
        name, bio, roles, 
        linkedin, github, twitter, instagram, email,
        experience, education, techStack 
    } = req.body;

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    // Text & Basic Info
    if (name) profile.name = name;
    if (bio) profile.bio = bio;
    
    if (roles) {
       profile.roles = typeof roles === 'string' 
         ? roles.split(',').map(r => r.trim()) 
         : roles;
    }

    // Socials
    profile.socials = {
      linkedin: linkedin || profile.socials?.linkedin || "",
      github: github || profile.socials?.github || "",
      twitter: twitter || profile.socials?.twitter || "",
      instagram: instagram || profile.socials?.instagram || "",
      email: email || profile.socials?.email || "",
    };

    //ARRAY PARSING
    if (experience) {
        try { profile.experience = JSON.parse(experience); } catch(e) { console.error("Exp Parse Error", e); }
    }
    if (education) {
        try { profile.education = JSON.parse(education); } catch(e) { console.error("Edu Parse Error", e); }
    }
    if (techStack) {
        try { profile.techStack = JSON.parse(techStack); } catch(e) { console.error("Tech Parse Error", e); }
    }

    // Files
    if (req.files['profileImage']) {
      profile.profileImage = req.files['profileImage'][0].path.replace(/\\/g, "/");
    }
    if (req.files['resume']) {
      profile.resume = req.files['resume'][0].path.replace(/\\/g, "/");
    }

    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;