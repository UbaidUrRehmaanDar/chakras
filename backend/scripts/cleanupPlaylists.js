const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chakras';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Clean up duplicate favorite playlists
const cleanupFavoritePlaylists = async () => {
    try {
        const users = await User.find({});
        
        for (const user of users) {
            console.log(`\nChecking user: ${user.username}`);
            
            // Find the "Favorites" playlist specifically
            const favoritesPlaylist = user.playlists.find(playlist => 
                playlist.name.toLowerCase() === 'favorites'
            );
            
            // Find other favorite-type playlists
            const otherFavoriteVariations = user.playlists.filter(playlist => {
                const name = playlist.name.toLowerCase();
                return (name.includes('favorite') || name.includes('favourite') || name.includes('liked')) 
                       && name !== 'favorites';
            });
            
            if (favoritesPlaylist) {
                console.log(`Found "Favorites" playlist with ${favoritesPlaylist.songs.length} songs`);
                
                if (otherFavoriteVariations.length > 0) {
                    console.log('Other favorite-type playlists found:');
                    otherFavoriteVariations.forEach((playlist, index) => {
                        console.log(`  ${index + 1}. "${playlist.name}" (${playlist.songs.length} songs)`);
                    });
                }
                
                // Remove the "Favorites" playlist since "Liked Songs" already exists
                console.log('Removing "Favorites" playlist...');
                user.playlists = user.playlists.filter(playlist => 
                    playlist.name.toLowerCase() !== 'favorites'
                );
                
                await user.save();
                console.log('✅ "Favorites" playlist removed successfully!');
            } else {
                console.log('No "Favorites" playlist found');
                
                if (otherFavoriteVariations.length > 0) {
                    console.log('Other favorite-type playlists found:');
                    otherFavoriteVariations.forEach((playlist, index) => {
                        console.log(`  ${index + 1}. "${playlist.name}" (${playlist.songs.length} songs)`);
                    });
                }
            }
        }
        
        console.log('\n✅ Cleanup complete!');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run the script
const run = async () => {
    await connectDB();
    await cleanupFavoritePlaylists();
};

run();
