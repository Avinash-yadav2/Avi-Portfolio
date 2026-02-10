const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); 

// Import Routes
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE (Fixed CORS Settings) ---
app.use(cors({
    origin: [
        "http://localhost:5173",  // Local Development
        "http://localhost:5174",  // Local Development (Alt Port)
        "https://avi-portfolio-six.vercel.app" // Live Frontend URL
    ], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// STATIC FOLDER SETUP
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('📂 Created "uploads" directory automatically.');
}

app.use('/uploads', express.static(uploadDir)); 

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 MongoDB Connected Successfully!'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); 
  });

// API ROUTES
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

// TEST ROUTE (To check if backend is live)
app.get('/', (req, res) => {
  res.send('API is Running Smoothly... 🚀');
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});