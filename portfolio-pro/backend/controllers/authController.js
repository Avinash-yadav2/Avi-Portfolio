// controllers/authController.js
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Setup master admin (Only works if no admin exists)
// @route   POST /api/auth/setup
// @access  Public (One-time use)
exports.setupAdmin = async (req, res, next) => {
    try {
        const adminExists = await Admin.countDocuments({});
        if (adminExists > 0) {
            return res.status(403).json({ message: 'Admin already configured. Setup locked.' });
        }

        const { email, password } = req.body;
        const admin = await Admin.create({ email, password });

        res.status(201).json({
            _id: admin._id,
            email: admin.email,
            token: generateToken(admin._id),
            message: 'Master Admin created successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};