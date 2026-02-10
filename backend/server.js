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

const app = express();
const PORT = process.env.PORT || 5000;

//CORS SETUP ---
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://avi-portfolio-six.vercel.app" //  Live Frontend
];

app.use(cors({
    origin: function (origin, callback) {
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("🚫 CORS Blocked Origin:", origin); // Render logs 
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Pre-flight request 
app.options('*', cors()); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// STATIC FOLDER
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir)); 

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 MongoDB Connected Successfully!'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); 
  });

// ROUTES
app.use('/api/auth', authRoutes);       
app.use('/api/projects', projectRoutes); 
app.use('/api/profile', profileRoutes);  
app.use('/api/contact', contactRoutes); 

app.get('/', (req, res) => {
  res.send('API is Live & Working! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});