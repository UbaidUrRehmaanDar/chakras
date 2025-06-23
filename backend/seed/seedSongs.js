const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

// Load environment variables
dotenv.config();

// Sample song data
const sampleSongs = [
  {
    "title": "315",
    "artist": "AP Dhillon, Shinda Kahlon, Jazzy B",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 131,
    "coverImage": "AP_Dhillon__Shinda_Kahlon__Jazzy_B_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - 315.mp3"
  },
  {
    "title": "After Midnight",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 195,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - After Midnight.mp3"
  },
  {
    "title": "Bora Bora",
    "artist": "AP Dhillon, Ayra Starr",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 155,
    "coverImage": "",
    "filePath": "AP Dhillon - Bora Bora.mp3"
  },
  {
    "title": "Brownprint",
    "artist": "AP Dhillon, Shinda Kahlon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 136,
    "coverImage": "AP_Dhillon__Shinda_Kahlon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - Brownprint.mp3"
  },
  {
    "title": "Distance",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 131,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - Distance.mp3"
  },
  {
    "title": "Losing Myself",
    "artist": "AP Dhillon, Gunna",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 178,
    "coverImage": "",
    "filePath": "AP Dhillon - Losing Myself.mp3"
  },
  {
    "title": "Old Money",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 128,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - Old Money.mp3"
  },
  {
    "title": "Sweet Flower",
    "artist": "AP Dhillon, Syra",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 176,
    "coverImage": "AP_Dhillon__Syra_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - Sweet Flower.mp3"
  },
  {
    "title": "TERE TE",
    "artist": "AP Dhillon",
    "album": "HIDDEN GEMS",
    "genre": "Rap",
    "duration": 114,
    "coverImage": "AP_Dhillon_HIDDEN_GEMS_cover.jpeg",
    "filePath": "AP Dhillon - TERE TE.mp3"
  },
  {
    "title": "To Be Continued…",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 205,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon - To Be Continued  (Bonus Track).mp3"
  }
];

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
