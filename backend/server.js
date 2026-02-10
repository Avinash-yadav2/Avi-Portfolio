const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS Import
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); 

// Import Routes
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 🔥 FINAL CORS FIX (Allow Everything) ---
// Hum 'origin: true' use karenge. Iska matlab: "Jo bhi site request bheje, usse haan bol do."
app.use(cors({
  origin: true, 
  credentials: true, // Cookies/Token allow karega
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Pre-flight requests ko bhi forcefully handle karein
app.options('*', cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// STATIC FOLDER
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir)); 

// SERVER CONNECTION LOGS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => {
  res.send('Server is LIVE & Allowing All Origins! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});