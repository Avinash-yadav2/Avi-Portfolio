const mongoose = require('mongoose');

// --- SUB-SCHEMAS ---
const ExperienceSchema = new mongoose.Schema({
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  year: { type: String, default: "" },
  desc: { type: String, default: "" }
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  school: { type: String, default: "" },
  year: { type: String, default: "" }
});

const TechStackSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  level: { type: String, default: "50" }, // Percentage string
  color: { type: String, default: "#ffffff" }
});

// --- MAIN SCHEMA ---
const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: "Avinash Yadav" },
  roles: { type: [String], default: ["Full Stack Developer"] }, 
  bio: { type: String, default: "Building digital experiences that matter." },
  
  // Files
  profileImage: { type: String, default: "" }, 
  resume: { type: String, default: "" }, 
  
  // Social Links
  socials: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    email: { type: String, default: "" }
  },

  // --- NEW FIELDS (Arrays) ---
  experience: { type: [ExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  techStack: { type: [TechStackSchema], default: [] }

}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);