const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: [String], // ["React", "Node", "MongoDB"]
  liveLink: String,
  repoLink: String,
  image: String, // Project Screenshot
  featured: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Project', ProjectSchema);