const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');

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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); 
  });

app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => {
  res.json({ message: "Backend is Live & CORS is Fixed! 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});