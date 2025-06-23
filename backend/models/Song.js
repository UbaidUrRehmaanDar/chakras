const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        default: 'Unknown Album'
    },
    genre: {
        type: String,
        default: 'Unknown Genre'
    },
    duration: {
        type: Number,
        default: 0
    },
    coverImage: {
        type: String,
        default: 'default-cover.jpg'
    },
    filePath: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;