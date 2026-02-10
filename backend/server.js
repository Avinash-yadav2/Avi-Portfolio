const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); 
// Routes
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- 🔥 NUCLEAR CORS FIX (MANUAL HEADERS) ---
// Hum kisi package par bharosa nahi karenge, khud headers set karenge
app.use((req, res, next) => {
  // Aapka Frontend URL (Exact match hona chahiye)
  const allowedOrigin = "https://avi-portfolio-six.vercel.app";
  
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true"); // Cookies allow

  // Agar browser OPTIONS request bheje (Pre-flight check), toh turant HAAN bol do
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Static Folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir)); 

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => res.send('Backend is Working with Manual CORS 🚀'));

app.listen(PORT, () => console.log(`🚀 Server running on Port: ${PORT}`));