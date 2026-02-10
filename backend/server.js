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

// --- 🛠️ DEBUGGING CORS SETUP ---
// Ye function check karega ki request kahan se aa rahi hai
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed Origins List
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://avi-portfolio-six.vercel.app" // Dhyan rahe: No Slash at end
    ];

    // !origin matlab Postman ya Server-to-Server request (Allow them)
    // allowedOrigins.includes(origin) matlab Vercel ya Localhost check
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚫 CORS BLOCKED THIS ORIGIN:", origin); // Ye Render Log me dikhega
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cookies/Token headers allow karne ke liye
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware lagana (Sabse upar)
app.use(cors(corsOptions));

// Pre-flight requests handle karna (OPTIONS request)
app.options('*', cors(corsOptions));

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
  res.send('API is Live & CORS Fixed! 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});