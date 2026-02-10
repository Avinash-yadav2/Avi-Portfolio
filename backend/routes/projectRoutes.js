const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

//MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

//GET ALL PROJECTS (Public)
// GET /api/projects
router.get('/', async (req, res) => {
  try {
    // Sort by newest first
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW PROJECT (Admin)
// POST /api/projects
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, techStack, liveLink, repoLink } = req.body;

  // Validate Image
  if (!req.file) {
    return res.status(400).json({ message: "Project Image is required" });
  }

  // Convert "React, Node" string -> Array ["React", "Node"]
  let techArray = techStack;
  if (typeof techStack === 'string') {
     techArray = techStack.split(',').map(t => t.trim());
  }

  const project = new Project({
    title,
    description,
    techStack: techArray,
    liveLink,
    repoLink,
    image: req.file.path.replace(/\\/g, "/") // Fix Windows paths
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 4. DELETE PROJECT 
// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    // 1. Find Project by ID
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    // 2. Delete Image File from 'uploads'
    if (project.image) {
        const imagePath = path.join(__dirname, '../', project.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); 
        }
    }

    // 3. Delete from Database
    await Project.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Project Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;