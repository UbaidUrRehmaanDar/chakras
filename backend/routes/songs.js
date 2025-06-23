const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET /api/songs - Fetch all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().sort({ uploadedAt: -1 });
        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/songs/favorites - Get all favorites from the logged in user
router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        console.log('Getting favorites for user:', req.user.id);
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Make sure favorites is initialized
        if (!user.favorites || !Array.isArray(user.favorites) || user.favorites.length === 0) {
            if (!user.favorites) {
                user.favorites = [];
                await user.save();
            }
            return res.json([]);
        }
        
        // Get the actual song objects
        const favorites = await Song.find({ _id: { $in: user.favorites } });
        console.log(`Found ${favorites.length} favorite songs for user ${user.username}`);
        
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error fetching favorites' });
    }
});

// POST /api/songs/favorites - Add a song to user's favorites
router.post('/favorites/:songId', authMiddleware, async (req, res) => {
    try {
        console.log(`Adding song ${req.params.songId} to favorites for user ${req.user.id}`);
        const user = await User.findById(req.user.id);
        const songId = req.params.songId;
        
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Initialize favorites array if it doesn't exist
        if (!user.favorites) {
            user.favorites = [];
        }
        
        // Check if song exists
        const song = await Song.findById(songId);
        if (!song) {
            console.log('Song not found');
            return res.status(404).json({ message: 'Song not found' });
        }
        
        // Check if song is already in favorites
        const isAlreadyFavorite = user.favorites.some(id => id.toString() === songId.toString());
        if (isAlreadyFavorite) {
            console.log('Song already in favorites');
            return res.status(400).json({ message: 'Song already in favorites' });
        }
        
        // Add to favorites
        user.favorites.push(songId);
        await user.save();
        console.log(`Song added to favorites, user now has ${user.favorites.length} favorites`);
        
        res.json({ message: 'Song added to favorites', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/songs/favorites/:songId - Remove song from favorites
router.delete('/favorites/:songId', authMiddleware, async (req, res) => {
    try {
        console.log(`Removing song ${req.params.songId} from favorites for user ${req.user.id}`);
        const user = await User.findById(req.user.id);
        const songId = req.params.songId;
        
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Initialize favorites array if it doesn't exist
        if (!user.favorites) {
            user.favorites = [];
            return res.json({ message: 'No favorites to remove', favorites: [] });
        }
        
        const originalLength = user.favorites.length;
        
        // Remove from favorites
        user.favorites = user.favorites.filter(id => id.toString() !== songId);
        await user.save();
        
        console.log(`Song removed from favorites, removed ${originalLength - user.favorites.length} songs`);
        
        res.json({ message: 'Song removed from favorites', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/songs/search/:query - Search for songs
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } },
                { album: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        
        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/songs/:id - Fetch a single song by ID (This must be the last route!)
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        
        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;