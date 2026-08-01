// utils/cloudinaryUpload.js
const cloudinary = require('../config/cloudinary');

// Pro-level approach: Convert memory buffer to Base64 DataURI. 
// No need to save files to the disk or install extra streaming packages.
const uploadToCloudinary = async (file, folderName = 'portfolio') => {
    try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: folderName,
            resource_type: 'auto' // Automatically handles images, PDFs (resume), etc.
        });
        
        return result.secure_url;
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

module.exports = uploadToCloudinary;