/**
 * Script to check user favorites in the database
 * Run with: node scripts/checkFavorites.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Song = require('../models/Song');

dotenv.config();

const checkFavorites = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected successfully');
    
    // Get all users
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    
    // Check favorites for each user
    for (const user of users) {
      console.log(`\nUser: ${user.username} (${user._id})`);
      
      if (!user.favorites || !Array.isArray(user.favorites)) {
        console.log('  No favorites array found');
        continue;
      }
      
      console.log(`  Has ${user.favorites.length} favorite songs`);
      
      // Print favorite song IDs
      for (const favId of user.favorites) {
        console.log(`  - ${favId}`);
        
        // Check if the song exists
        try {
          const song = await Song.findById(favId);
          if (song) {
            console.log(`    Found: ${song.title} by ${song.artist}`);
          } else {
            console.log(`    ERROR: Song not found in database`);
          }
        } catch (err) {
          console.log(`    ERROR: Invalid song ID (${err.message})`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error checking favorites:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

// Run the function
checkFavorites();
