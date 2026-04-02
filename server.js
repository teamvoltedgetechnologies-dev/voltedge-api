require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://localhost:5173,https://voltedge-website.onrender.com,https://voltedge-frontend-o2duj7bkb.vercel.app,https://voltedge-frontend-xi.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // 2. Allow if explicitly listed in our origins array
    const isAllowed = allowedOrigins.includes(origin);
    
    // 3. Allow any Vercel subdomain if not in production mode OR if explicitly safe
    const isVercel = origin.endsWith('.vercel.app');
    
    if (isAllowed || isVercel) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked: Origin ${origin} is not in the allowed list.`);
      callback(new Error(`CORS policy blocked access from origin ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'VoltEdge API is running!', status: 'online' });
});

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voltedge')
.then(() => console.log('✅ MongoDB connected successfully.'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
