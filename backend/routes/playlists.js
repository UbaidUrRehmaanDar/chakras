const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/auth');

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
    const { name } = req.body;
    
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
        user.playlists.push({
            name,
            songs: []
        });
        
        await user.save();
        
        res.status(201).json({ message: 'Playlist created successfully', playlists: user.playlists });
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
        }
        
        // Don't allow deleting the Favorites playlist
        const playlist = user.playlists.find(p => p._id.toString() === playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        if (playlist.name === 'Favorites') {
            return res.status(400).json({ message: 'Cannot delete the Favorites playlist' });
        }
        
        // Remove playlist
        user.playlists = user.playlists.filter(p => p._id.toString() !== playlistId);
        await user.save();
        
        res.json({ message: 'Playlist deleted successfully', playlists: user.playlists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
