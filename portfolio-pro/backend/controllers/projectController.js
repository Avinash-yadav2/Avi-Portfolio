// controllers/projectController.js
const Project = require('../models/Project');
const uploadToCloudinary = require('../utils/cloudinaryUpload');

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        const { title, description, liveLink, repoLink, techStack, featured, sortOrder } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Project image is required' });
        }

        const imageUrl = await uploadToCloudinary(req.file, 'portfolio/projects');

        const project = await Project.create({
            title,
            description,
            liveLink,
            repoLink,
            techStack: techStack ? JSON.parse(techStack) : [],
            featured: featured === 'true',
            sortOrder: sortOrder || 0,
            image: imageUrl
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        await project.deleteOne();
        res.status(200).json({ message: 'Project removed successfully' });
    } catch (error) {
        next(error);
    }
};