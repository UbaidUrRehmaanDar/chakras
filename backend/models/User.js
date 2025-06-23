const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    playlists: [{
        name: String,
        description: {
            type: String,
            default: ''
        },
        coverImage: {
            type: String,
            default: ''
        },
        songs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }]
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;