const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { exec } = require('child_process');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const albumRoutes = require('./routes/albums');
const uploadsRoutes = require('./routes/uploads');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS options for security
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use('/music', express.static('D:/Music')); // Music files from local directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // User uploads (avatars, etc.)

// API Routes
app.use('/api/auth', authRoutes); // Changed from /api to /api/auth for better organization
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/uploads', uploadsRoutes);

// Root route for API health check
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to Chakras Music API' });
});

// Root route redirect to API health check
app.get('/', (req, res) => {
    res.redirect('/api');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connected successfully');
        
        // Auto-scan disabled - use manual commands to scan/seed music
        console.log('🎵 Server ready! Use "npm run scan-music" or "npm run seed" to update music library manually.');
        
        app.listen(PORT, () => {
            console.log(`🎵 Chakras Music Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });