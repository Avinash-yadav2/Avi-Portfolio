const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, crop: "limit" }]
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, techStack, liveLink, repoLink } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Project Image is required" });
  }

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
    image: req.file.path
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (project.image) {
        const publicId = project.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`portfolio_projects/${publicId}`);
    }

    await Project.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Project Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;