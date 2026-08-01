const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    techStack: [{ type: String }], // e.g., ['React', 'Node.js', 'Tailwind']
    liveLink: { type: String },
    repoLink: { type: String },
    featured: { type: Boolean, default: false }, // Triggers the frontend badge
    sortOrder: { type: Number, default: 0 } // Controls display sequence
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);