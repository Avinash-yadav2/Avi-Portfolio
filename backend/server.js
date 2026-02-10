const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); 
// Routes imports
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. DEBUG LOGGER (Ye bataayega request aa rahi hai ya nahi) ---
app.use((req, res, next) => {
  console.log(`🔎 [INCOMING REQUEST]`);
  console.log(`   METHOD: ${req.method}`);
  console.log(`   URL: ${req.url}`);
  console.log(`   ORIGIN: ${req.headers.origin || 'No Origin (Postman/Server)'}`);
  next();
});

// --- 2. CORS SETUP (Sabse Important) ---
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://avi-portfolio-six.vercel.app" // Ensure ye URL match kare
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests ko allow karein

app.use(express.json()); 

// --- 3. SERVER CONNECTION LOGS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => res.send('Server is Running & Logging Enabled 🚀'));

app.listen(PORT, () => console.log(`🚀 Server started on Port ${PORT}`));