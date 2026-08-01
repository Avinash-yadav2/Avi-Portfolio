// controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const newMessage = await Message.create({ name, email, message });
        res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
    } catch (error) {
        next(error);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};