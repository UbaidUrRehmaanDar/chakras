const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const authMiddleware = require('../middleware/auth');

// GET /api/albums - Get all unique albums with enhanced data
router.get('/', async (req, res) => {
    try {
        // Get all unique albums with enhanced metadata
        const albums = await Song.aggregate([
            { 
                $match: { 
                    album: { 
                        $nin: ['Single', 'Unknown Album', '', null] 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: "$album",
                    artist: { $first: "$artist" },
                    coverImage: { $first: "$coverImage" },
                    genre: { $first: "$genre" },
                    songCount: { $sum: 1 },
                    totalDuration: { $sum: "$duration" },
                    songs: { 
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            duration: "$duration"
                        }
                    }
                } 
            },
            { 
                $project: {
                    albumName: "$_id",
                    artist: 1,
                    coverImage: 1,
                    genre: 1,
                    songCount: 1,
                    totalDuration: 1,
                    songs: 1,
                    _id: 0
                }
            },
            { 
                $sort: { 
                    artist: 1,
                    albumName: 1 
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
