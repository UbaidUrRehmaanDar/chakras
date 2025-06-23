const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Register request:', { username, email });

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists:', { email, username });
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            playlists: [{ name: 'Favorites', songs: [] }]
        });
        await newUser.save();
        console.log('User registered successfully:', { id: newUser._id, username });

        // Create token immediately upon registration
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request:', { email });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid credentials - user not found:', { email });
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials - password mismatch:', { email });
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User logged in successfully:', { id: user._id, username: user.username });
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('favorites');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { username, email, avatar } = req.body;
    
    // Build profile update object
    const profileFields = {};
    if (username) profileFields.username = username;
    if (email) profileFields.email = email;
    if (avatar) profileFields.avatar = avatar;
    
    try {
        // Check if username is already taken (if updating username)
        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }
        
        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: profileFields },
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;