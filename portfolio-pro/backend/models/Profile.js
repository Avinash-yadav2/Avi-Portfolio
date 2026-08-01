const mongoose = require('mongoose');

// Sub-schemas for clean array management
const experienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true }, // e.g., 'Soul Infotech'
    year: { type: String, required: true },
    desc: { type: String, required: true }
});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true }
});

const techStackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 }, // For the animated progress bars
    color: { type: String, default: '#00de51' } // Allows brand-matching per tech
});

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Alexander Isak' },
    roles: [{ type: String }], // Array for the typewriter effect
    bio: { type: String, required: true },
    profileImage: { type: String }, // Cloudinary URL
    resume: { type: String }, // Cloudinary PDF URL
    socials: {
        email: { type: String },
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    experience: [experienceSchema],
    education: [educationSchema],
    techStack: [techStackSchema]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);