const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET /api/songs - Fetch all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;