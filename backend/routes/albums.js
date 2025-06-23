const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const authMiddleware = require('../middleware/auth');

// GET /api/songs/albums - Get all unique album names
router.get('/', async (req, res) => {
    try {
        // Get all unique album names that are not 'Single' or 'Unknown Album'
        const albums = await Song.aggregate([
            { 
                $match: { 
                    album: { 
                        $nin: ['Single', 'Unknown Album', ''] 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: "$album",
                    artist: { $first: "$artist" },
                    coverImage: { $first: "$coverImage" },
                    songCount: { $sum: 1 }
                } 
            },
            { 
                $sort: { 
                    _id: 1 
                } 
            }
        ]);
        
        res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/songs/singles - Get all singles
router.get('/singles', async (req, res) => {
    try {
        // Get all songs marked as 'Single' or with no album
        const singles = await Song.find({
            $or: [
                { album: 'Single' },
                { album: { $in: ['', 'Unknown Album'] } }
            ]
        }).sort({ artist: 1, title: 1 });
        
        res.json(singles);
    } catch (error) {
        console.error('Error fetching singles:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/songs/album/:albumName - Get songs from a specific album
router.get('/album/:albumName', async (req, res) => {
    try {
        const albumName = req.params.albumName;
        const songs = await Song.find({ album: albumName }).sort({ title: 1 });
        
        if (songs.length === 0) {
            return res.status(404).json({ message: 'Album not found or has no songs' });
        }
        
        res.json(songs);
    } catch (error) {
        console.error('Error fetching album songs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
