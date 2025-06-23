const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/auth');

// Configure multer for playlist cover image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'playlist-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// GET /api/playlists - Get all playlists of the current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'playlists.songs',
            model: 'Song'
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user.playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/playlists - Create a new playlist
router.post('/', authMiddleware, async (req, res) => {
    const { name, description, isPublic } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Playlist name is required' });
    }
    
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if playlist already exists
        const playlistExists = user.playlists.some(playlist => playlist.name === name);
        if (playlistExists) {
            return res.status(400).json({ message: 'Playlist with this name already exists' });
        }
        
        // Add new playlist
        const newPlaylist = {
            name,
            description: description || '',
            isPublic: isPublic || false,
            songs: [],
            likes: [],
            createdAt: new Date()
        };
        
        user.playlists.push(newPlaylist);
        await user.save();
        
        // Get the created playlist (last one)
        const createdPlaylist = user.playlists[user.playlists.length - 1];
        
        res.status(201).json({ 
            message: 'Playlist created successfully', 
            playlist: createdPlaylist,
            _id: createdPlaylist._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/playlists/:playlistId/songs/:songId - Add a song to a playlist
router.post('/:playlistId/songs/:songId', authMiddleware, async (req, res) => {
    const { playlistId, songId } = req.params;
    
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if song exists
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        
        // Find the playlist
        const playlistIndex = user.playlists.findIndex(p => p._id.toString() === playlistId);
        if (playlistIndex === -1) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        // Check if song is already in the playlist
        const playlist = user.playlists[playlistIndex];
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }
        
        // Add song to playlist
        playlist.songs.push(songId);
        await user.save();
        
        res.json({ message: 'Song added to playlist', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/playlists/:playlistId/songs/:songId - Remove a song from a playlist
router.delete('/:playlistId/songs/:songId', authMiddleware, async (req, res) => {
    const { playlistId, songId } = req.params;
    
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the playlist
        const playlistIndex = user.playlists.findIndex(p => p._id.toString() === playlistId);
        if (playlistIndex === -1) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        // Remove song from playlist
        const playlist = user.playlists[playlistIndex];
        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await user.save();
        
        res.json({ message: 'Song removed from playlist', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/playlists/:playlistId - Delete a playlist
router.delete('/:playlistId', authMiddleware, async (req, res) => {
    const { playlistId } = req.params;
    
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }        // Check if playlist exists
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        // Don't allow deleting system playlists that are still needed
        // (Removed protection for "Favorites" since user wants it deleted)
        // You can add protection for other system playlists here if needed
        
        // Remove playlist
        user.playlists = user.playlists.filter(p => p._id.toString() !== playlistId);
        await user.save();
        
        res.json({ message: 'Playlist deleted successfully', playlists: user.playlists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/playlists/:playlistId/cover - Upload playlist cover image
router.put('/:playlistId/cover', authMiddleware, upload.single('coverImage'), async (req, res) => {
    const { playlistId } = req.params;
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the playlist
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        // Update cover image
        playlist.coverImage = req.file.filename;
        await user.save();
        
        res.json({ 
            message: 'Cover image updated successfully', 
            coverImage: req.file.filename,
            playlist 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/playlists/:playlistId - Update playlist details
router.put('/:playlistId', authMiddleware, async (req, res) => {
    const { playlistId } = req.params;
    const { name, description, isPublic } = req.body;
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the playlist
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        // Update playlist details
        if (name !== undefined) playlist.name = name;
        if (description !== undefined) playlist.description = description;
        if (isPublic !== undefined) playlist.isPublic = isPublic;
        
        await user.save();
        
        res.json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/playlists/public - Get all public playlists
router.get('/public', async (req, res) => {
    try {
        const users = await User.find({
            'playlists.isPublic': true
        }).populate({
            path: 'playlists.songs',
            model: 'Song'
        }).select('username playlists');
        
        const publicPlaylists = [];
        users.forEach(user => {
            user.playlists.forEach(playlist => {
                if (playlist.isPublic) {
                    publicPlaylists.push({
                        ...playlist.toObject(),
                        owner: {
                            _id: user._id,
                            username: user.username
                        }
                    });
                }
            });
        });
        
        res.json(publicPlaylists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/playlists/:playlistId/like - Like/unlike a public playlist
router.post('/:playlistId/like', authMiddleware, async (req, res) => {
    const { playlistId } = req.params;
    
    try {
        // Find the user who owns the playlist
        const playlistOwner = await User.findOne({
            'playlists._id': playlistId,
            'playlists.isPublic': true
        });
        
        if (!playlistOwner) {
            return res.status(404).json({ message: 'Public playlist not found' });
        }
        
        const playlist = playlistOwner.playlists.find(p => p._id.toString() === playlistId);
        const userIdString = req.user.id;
        
        // Check if user already liked this playlist
        const likeIndex = playlist.likes.indexOf(userIdString);
        
        if (likeIndex > -1) {
            // Unlike - remove from likes
            playlist.likes.splice(likeIndex, 1);
            await playlistOwner.save();
            res.json({ message: 'Playlist unliked', isLiked: false, likesCount: playlist.likes.length });
        } else {
            // Like - add to likes
            playlist.likes.push(userIdString);
            await playlistOwner.save();
            res.json({ message: 'Playlist liked', isLiked: true, likesCount: playlist.likes.length });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });    }
});

// DELETE /api/playlists/cleanup/favorites - Remove the "Favorites" playlist specifically
router.delete('/cleanup/favorites', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find and remove the "Favorites" playlist
        const favoritesPlaylist = user.playlists.find(p => p.name.toLowerCase() === 'favorites');
        
        if (!favoritesPlaylist) {
            return res.status(404).json({ message: 'Favorites playlist not found' });
        }
        
        // Remove the Favorites playlist
        user.playlists = user.playlists.filter(p => p.name.toLowerCase() !== 'favorites');
        await user.save();
        
        res.json({ 
            message: 'Favorites playlist deleted successfully', 
            deletedPlaylist: favoritesPlaylist.name,
            remainingPlaylists: user.playlists.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/playlists/:id - Get a specific playlist by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // First try to find in current user's playlists (if authenticated)
        if (req.headers['x-auth-token']) {
            try {
                const decoded = require('jsonwebtoken').verify(req.headers['x-auth-token'], process.env.JWT_SECRET || 'your-jwt-secret');
                const user = await User.findById(decoded.user.id).populate({
                    path: 'playlists.songs',
                    model: 'Song'
                });
                
                if (user) {
                    const userPlaylist = user.playlists.find(p => p._id.toString() === id);
                    if (userPlaylist) {
                        return res.json(userPlaylist);
                    }
                }
            } catch (authError) {
                // Continue to search in public playlists if auth fails
            }
        }
        
        // If not found in user's playlists or no auth, search in public playlists
        const users = await User.find({
            'playlists._id': id,
            'playlists.isPublic': true
        }).populate({
            path: 'playlists.songs',
            model: 'Song'
        }).select('username playlists');
        
        for (const user of users) {
            const playlist = user.playlists.find(p => p._id.toString() === id && p.isPublic);
            if (playlist) {
                return res.json({
                    ...playlist.toObject(),
                    owner: {
                        _id: user._id,
                        username: user.username
                    }
                });
            }
        }
        
        res.status(404).json({ message: 'Playlist not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
