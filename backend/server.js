const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Path require kar liya safety ke liye

// Routes
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');

// CORS SETUP
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://avi-portfolio-six.vercel.app"
  ],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests handle karega

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); 
  });

// API ROUTES
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => {
  res.json({ message: "Backend is Live & Cloudinary Connected! 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});