const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Contact = require('../models/Contact'); 

dotenv.config();

//SEND EMAIL & SAVE TO DB (Public) 
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // A. Save to Database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // B. Send Email (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    const mailOptions = {
      from: `Portfolio <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      replyTo: email, 
      subject: `🚀 New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "Message sent & saved!" });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//GET ALL MESSAGES (Admin)
router.get('/', async (req, res) => {
    try {
        // Sort by newest first
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//DELETE MESSAGE (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;