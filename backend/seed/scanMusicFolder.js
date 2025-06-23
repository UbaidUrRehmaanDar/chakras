const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mm = require('music-metadata');

// Directory to scan
const MUSIC_DIR = 'D:/Music';
const MAX_SONGS = 20; // Limit the number of songs for initial seeding

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Function to scan the music directory
async function scanMusicDirectory(dir) {
  try {
    const files = await readdir(dir);
    const musicFiles = [];
    let count = 0;

    for (const file of files) {
      if (count >= MAX_SONGS) break;

      const filePath = path.join(dir, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        // Skip directories for simplicity
        continue;
      }

      // Check if it's a music file (mp3, m4a, wav, etc.)
      const ext = path.extname(file).toLowerCase();
      if (['.mp3', '.m4a', '.wav', '.flac', '.ogg'].includes(ext)) {
        try {
          // Extract metadata from the music file
          const metadata = await mm.parseFile(filePath);
          
          const title = metadata.common.title || path.basename(file, ext);
          const artist = metadata.common.artist || 'Unknown Artist';
          const album = metadata.common.album || 'Unknown Album';
          const genre = metadata.common.genre?.[0] || 'Unknown Genre';
          const duration = Math.round(metadata.format.duration) || 180;
          
          // Handle cover art if available in the metadata
          let coverImage = '';
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const coverExt = picture.format.split('/').pop().toLowerCase();
            const coverFileName = `${artist.replace(/[^a-z0-9]/gi, '_')}_${album.replace(/[^a-z0-9]/gi, '_')}_cover.${coverExt}`;
            
            try {
              // Save cover image to uploads folder
              fs.writeFileSync(path.join(UPLOADS_DIR, coverFileName), picture.data);
              coverImage = coverFileName;
              console.log(`Saved cover image: ${coverFileName}`);
            } catch (err) {
              console.error(`Error saving cover image: ${err.message}`);
            }
          }
          
          musicFiles.push({
            title,
            artist,
            album,
            genre,
            duration,
            coverImage,
            filePath: path.relative(MUSIC_DIR, filePath).replace(/\\/g, '/'), // Store relative path
          });
          
          count++;
          console.log(`Processed: ${title} by ${artist}`);
        } catch (metadataError) {
          console.error(`Error processing metadata for ${file}:`, metadataError.message);
          
          // Add a basic entry without metadata
          musicFiles.push({
            title: path.basename(file, ext),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            genre: 'Unknown',
            duration: 180, // Default 3 min
            coverImage: '',
            filePath: path.relative(MUSIC_DIR, filePath).replace(/\\/g, '/'),
          });
          count++;
        }
      }
    }

    return musicFiles;
  } catch (error) {
    console.error('Error scanning music directory:', error);
    return [];
  }
}

// Update the seed file
async function updateSeedFile() {
  try {
    // Get music files
    const songs = await scanMusicDirectory(MUSIC_DIR);
    
    if (songs.length === 0) {
      console.log('No music files found in the directory');
      return;
    }

    // Create seed data content
    const seedData = `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

// Load environment variables
dotenv.config();

// Sample song data
const sampleSongs = ${JSON.stringify(songs, null, 2)};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding');
    
    // Delete existing songs
    await Song.deleteMany({});
    console.log('Existing songs deleted');
    
    // Insert new songs
    await Song.insertMany(sampleSongs);
    console.log('Sample songs seeded successfully!');
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
`;

    // Write to file
    fs.writeFileSync(
      path.join(__dirname, 'seedSongs.js'),
      seedData
    );
    
    console.log(`Successfully created seed file with ${songs.length} songs!`);
  } catch (error) {
    console.error('Error updating seed file:', error);
  }
}

// Run the script
updateSeedFile();
