const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

// Load environment variables
dotenv.config();

// Sample song data (Auto-generated from music scan)
const sampleSongs = [
  {
    "title": "Goriye",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 181,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Goriye.mp3"
  },
  {
    "title": "Havaa",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 207,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Havaa.mp3"
  },
  {
    "title": "Judaa 3 Title Track",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 227,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Judaa 3 Title Track.mp3"
  },
  {
    "title": "Kafka",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 192,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Kafka.mp3"
  },
  {
    "title": "Kamli Jehi",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 204,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Kamli Jehi.mp3"
  },
  {
    "title": "Reflection",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 161,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Reflection.mp3"
  },
  {
    "title": "Sunkissed",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 179,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - Sunkissed.mp3"
  },
  {
    "title": "That Girl",
    "artist": "Amrinder Gill",
    "album": "Judaa 3 Chapter 2",
    "genre": "Unknown Genre",
    "duration": 157,
    "coverImage": "Amrinder_Gill_Judaa_3_Chapter_2_cover.jpeg",
    "filePath": "Amrinder Gill/Amrinder Gill - That Girl.mp3"
  },
  {
    "title": "315",
    "artist": "AP Dhillon, Shinda Kahlon, Jazzy B",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 131,
    "coverImage": "AP_Dhillon__Shinda_Kahlon__Jazzy_B_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - 315.mp3"
  },
  {
    "title": "After Midnight",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 195,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - After Midnight.mp3"
  },
  {
    "title": "Bora Bora",
    "artist": "AP Dhillon, Ayra Starr",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 155,
    "coverImage": "",
    "filePath": "AP Dhillon/AP Dhillon - Bora Bora.mp3"
  },
  {
    "title": "Brownprint",
    "artist": "AP Dhillon, Shinda Kahlon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 136,
    "coverImage": "AP_Dhillon__Shinda_Kahlon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - Brownprint.mp3"
  },
  {
    "title": "Distance",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 131,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - Distance.mp3"
  },
  {
    "title": "Losing Myself",
    "artist": "AP Dhillon, Gunna",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 178,
    "coverImage": "",
    "filePath": "AP Dhillon/AP Dhillon - Losing Myself.mp3"
  },
  {
    "title": "Old Money",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 128,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - Old Money.mp3"
  },
  {
    "title": "Sweet Flower",
    "artist": "AP Dhillon, Syra",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 176,
    "coverImage": "AP_Dhillon__Syra_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - Sweet Flower.mp3"
  },
  {
    "title": "TERE TE",
    "artist": "AP Dhillon",
    "album": "HIDDEN GEMS",
    "genre": "Rap",
    "duration": 114,
    "coverImage": "AP_Dhillon_HIDDEN_GEMS_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - TERE TE.mp3"
  },
  {
    "title": "To Be Continued…",
    "artist": "AP Dhillon",
    "album": "The Brownprint",
    "genre": "Rap",
    "duration": 205,
    "coverImage": "AP_Dhillon_The_Brownprint_cover.jpeg",
    "filePath": "AP Dhillon/AP Dhillon - To Be Continued  (Bonus Track).mp3"
  },
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
  },
  {
    "title": "Akheriwaar",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 91,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Akheriwaar.mp3"
  },
  {
    "title": "Azhik",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 89,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Azhik.mp3"
  },
  {
    "title": "Bekhabar",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 296,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Bekhabar.mp3"
  },
  {
    "title": "Daira",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 132,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Daira.mp3"
  },
  {
    "title": "Darya",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 62,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Darya.mp3"
  },
  {
    "title": "Jaag",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 118,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Jaag.mp3"
  },
  {
    "title": "Kahan Jaoon",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 329,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Kahan Jaoon.mp3"
  },
  {
    "title": "Khel Tamaasha [Bonus Track] (Unplugged)",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 389,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Khel Tamaasha [Bonus Track] (Unplugged).mp3"
  },
  {
    "title": "Koi Saaya",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 337,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Koi Saaya.mp3"
  },
  {
    "title": "Maand",
    "artist": "Bayaan, Hasan Raheem, Rovalio",
    "album": "Safar",
    "genre": "Pop",
    "duration": 185,
    "coverImage": "Bayaan__Hasan_Raheem__Rovalio_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Maand.mp3"
  },
  {
    "title": "Mera Musafir",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 291,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Mera Musafir.mp3"
  },
  {
    "title": "Milaap",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 308,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Milaap.mp3"
  },
  {
    "title": "Paani Aur Mitti",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 358,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Paani Aur Mitti.mp3"
  },
  {
    "title": "Saahil",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 173,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Saahil.mp3"
  },
  {
    "title": "Safar",
    "artist": "Bayaan, Sherazam",
    "album": "Safar",
    "genre": "Pop",
    "duration": 217,
    "coverImage": "Bayaan__Sherazam_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Safar.mp3"
  },
  {
    "title": "Suno",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 292,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Suno.mp3"
  },
  {
    "title": "Tere Naal",
    "artist": "Bayaan, Sanah Moidutty, Vaibhav Pani",
    "album": "Safar",
    "genre": "Pop",
    "duration": 238,
    "coverImage": "Bayaan__Sanah_Moidutty__Vaibhav_Pani_Safar_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Tere Naal.mp3"
  },
  {
    "title": "Teri Tasveer",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 299,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Teri Tasveer.mp3"
  },
  {
    "title": "Tifl",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 352,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan/Bayaan - Tifl.mp3"
  },
  {
    "title": "Akheriwaar",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 91,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Akheriwaar.mp3"
  },
  {
    "title": "Azhik",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 89,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Azhik.mp3"
  },
  {
    "title": "Bekhabar",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 296,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Bekhabar.mp3"
  },
  {
    "title": "Daira",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 132,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Daira.mp3"
  },
  {
    "title": "Darya",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 62,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Darya.mp3"
  },
  {
    "title": "Jaag",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 118,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Jaag.mp3"
  },
  {
    "title": "Kahan Jaoon",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 329,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Kahan Jaoon.mp3"
  },
  {
    "title": "Khel Tamaasha [Bonus Track] (Unplugged)",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 389,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Khel Tamaasha [Bonus Track] (Unplugged).mp3"
  },
  {
    "title": "Koi Saaya",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 337,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Koi Saaya.mp3"
  },
  {
    "title": "Maand",
    "artist": "Bayaan, Hasan Raheem, Rovalio",
    "album": "Safar",
    "genre": "Pop",
    "duration": 185,
    "coverImage": "Bayaan__Hasan_Raheem__Rovalio_Safar_cover.jpeg",
    "filePath": "Bayaan - Maand.mp3"
  },
  {
    "title": "Mera Musafir",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 291,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Mera Musafir.mp3"
  },
  {
    "title": "Milaap",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 308,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Milaap.mp3"
  },
  {
    "title": "Paani Aur Mitti",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 358,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Paani Aur Mitti.mp3"
  },
  {
    "title": "Saahil",
    "artist": "Bayaan",
    "album": "Safar",
    "genre": "Pop",
    "duration": 173,
    "coverImage": "Bayaan_Safar_cover.jpeg",
    "filePath": "Bayaan - Saahil.mp3"
  },
  {
    "title": "Safar",
    "artist": "Bayaan, Sherazam",
    "album": "Safar",
    "genre": "Pop",
    "duration": 217,
    "coverImage": "Bayaan__Sherazam_Safar_cover.jpeg",
    "filePath": "Bayaan - Safar.mp3"
  },
  {
    "title": "Suno",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 292,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Suno.mp3"
  },
  {
    "title": "Tere Naal",
    "artist": "Bayaan, Sanah Moidutty, Vaibhav Pani",
    "album": "Safar",
    "genre": "Pop",
    "duration": 238,
    "coverImage": "Bayaan__Sanah_Moidutty__Vaibhav_Pani_Safar_cover.jpeg",
    "filePath": "Bayaan - Tere Naal.mp3"
  },
  {
    "title": "Teri Tasveer",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Rock",
    "duration": 299,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Teri Tasveer.mp3"
  },
  {
    "title": "Tifl",
    "artist": "Bayaan",
    "album": "Suno",
    "genre": "Рок",
    "duration": 352,
    "coverImage": "Bayaan_Suno_cover.jpeg",
    "filePath": "Bayaan - Tifl.mp3"
  },
  {
    "title": "Amiri",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 118,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Amiri.mp3"
  },
  {
    "title": "Bad Habits",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 168,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Bad Habits.mp3"
  },
  {
    "title": "Cry Later",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 148,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Cry Later.mp3"
  },
  {
    "title": "Drowning",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 160,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Drowning.mp3"
  },
  {
    "title": "Icon",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 149,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Icon.mp3"
  },
  {
    "title": "Kinni Kinni",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 213,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Kinni Kinni.mp3"
  },
  {
    "title": "Lalkara",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 161,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Lalkara.mp3"
  },
  {
    "title": "Poppin'",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 154,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Poppin.mp3"
  },
  {
    "title": "Psychotic",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 275,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Psychotic.mp3"
  },
  {
    "title": "Stars",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 184,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Stars.mp3"
  },
  {
    "title": "Whatcha Doin'",
    "artist": "Diljit Dosanjh",
    "album": "Ghost",
    "genre": "Pop",
    "duration": 137,
    "coverImage": "Diljit_Dosanjh_Ghost_cover.jpeg",
    "filePath": "Diljeet/Diljit Dosanjh - Whatcha Doin.mp3"
  },
  {
    "title": "40 Pra",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 193,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - 40 Pra.mp3"
  },
  {
    "title": "Aaja We Mahiya",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 232,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Aaja We Mahiya.mp3"
  },
  {
    "title": "Amplifier",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 233,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Amplifier.mp3"
  },
  {
    "title": "Bounce Billo",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 247,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Bounce Billo.mp3"
  },
  {
    "title": "Gora Gora Rang",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 245,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Gora Gora Rang.mp3"
  },
  {
    "title": "Hey Girl",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 201,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Hey Girl.mp3"
  },
  {
    "title": "Nai Reina",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 185,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Nai Reina.mp3"
  },
  {
    "title": "Nazar",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 185,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Nazar.mp3"
  },
  {
    "title": "Ni Nachleh",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 215,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Ni Nachleh.mp3"
  },
  {
    "title": "Pata Chalgea",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 230,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Pata Chalgea.mp3"
  },
  {
    "title": "Peli Waar",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 191,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Peli Waar.mp3"
  },
  {
    "title": "Qott Ghusian Da",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 178,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Qott Ghusian Da.mp3"
  },
  {
    "title": "Superstar",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 206,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Imran Khan - Superstar.mp3"
  },
  {
    "title": "Chak Glass",
    "artist": "Imran Khan",
    "album": "Unforgettable",
    "genre": "Unknown Genre",
    "duration": 188,
    "coverImage": "Imran_Khan_Unforgettable_cover.jpeg",
    "filePath": "Imran Khan/Unforgettable CD 1 TRACK 5 (320).mp3"
  },
  {
    "title": "BACK TO ME",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 296,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - BACK TO ME.mp3"
  },
  {
    "title": "BEG FORGIVENESS",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 369,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - BEG FORGIVENESS.mp3"
  },
  {
    "title": "BURN",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 111,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - BURN.mp3"
  },
  {
    "title": "CARNIVAL",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 264,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - CARNIVAL.mp3"
  },
  {
    "title": "DO IT",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 225,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - DO IT.mp3"
  },
  {
    "title": "FUK SUMN",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 210,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - FUK SUMN.mp3"
  },
  {
    "title": "HOODRAT",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 223,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - HOODRAT.mp3"
  },
  {
    "title": "KEYS TO MY LIFE",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 174,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - KEYS TO MY LIFE.mp3"
  },
  {
    "title": "KING",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 157,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - KING.mp3"
  },
  {
    "title": "PAID",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 195,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - PAID.mp3"
  },
  {
    "title": "PAPERWORK",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 146,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - PAPERWORK.mp3"
  },
  {
    "title": "PROBLEMATIC",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 195,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - PROBLEMATIC.mp3"
  },
  {
    "title": "STARS",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 115,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - STARS.mp3"
  },
  {
    "title": "TALKING",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 185,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - TALKING.mp3"
  },
  {
    "title": "VULTURES",
    "artist": "¥$",
    "album": "VULTURES 1",
    "genre": "Rap",
    "duration": 277,
    "coverImage": "___VULTURES_1_cover.jpeg",
    "filePath": "KanyeWest/Vultures1/$ - VULTURES.mp3"
  },
  {
    "title": "530",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 290,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - 530.mp3"
  },
  {
    "title": "BOMB",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 152,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - BOMB.mp3"
  },
  {
    "title": "DEAD",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 263,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - DEAD.mp3"
  },
  {
    "title": "FIELD TRIP",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 167,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - FIELD TRIP.mp3"
  },
  {
    "title": "FOREVER ROLLING",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 197,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - FOREVER ROLLING.mp3"
  },
  {
    "title": "FRIED",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 179,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - FRIED.mp3"
  },
  {
    "title": "HUSBAND",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 138,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - HUSBAND.mp3"
  },
  {
    "title": "LIFESTYLE",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 331,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - LIFESTYLE.mp3"
  },
  {
    "title": "MAYBE",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 135,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - MAYBE.mp3"
  },
  {
    "title": "MY SOUL",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 225,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - MY SOUL.mp3"
  },
  {
    "title": "PROMOTION",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 159,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - PROMOTION.mp3"
  },
  {
    "title": "RIVER",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 247,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - RIVER.mp3"
  },
  {
    "title": "SKY CITY",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 231,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - SKY CITY.mp3"
  },
  {
    "title": "SLIDE",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 198,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - SLIDE.mp3"
  },
  {
    "title": "TIME MOVING SLOW",
    "artist": "¥$, Kanye West, Ty Dolla $ign",
    "album": "VULTURES 2",
    "genre": "Rap",
    "duration": 160,
    "coverImage": "____Kanye_West__Ty_Dolla__ign_VULTURES_2_cover.jpeg",
    "filePath": "KanyeWest/Vultures2/$ - TIME MOVING SLOW.mp3"
  },
  {
    "title": "ANTIDOTE",
    "artist": "Karan Aujla",
    "album": "Four Me",
    "genre": "Pop",
    "duration": 187,
    "coverImage": "Karan_Aujla_Four_Me_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - ANTIDOTE.mp3"
  },
  {
    "title": "Courtside",
    "artist": "Karan Aujla, Signature By Sb",
    "album": "Courtside",
    "genre": "Pop",
    "duration": 168,
    "coverImage": "Karan_Aujla__Signature_By_Sb_Courtside_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - Courtside.mp3"
  },
  {
    "title": "IDK HOW",
    "artist": "Karan Aujla",
    "album": "Four Me",
    "genre": "Pop",
    "duration": 176,
    "coverImage": "Karan_Aujla_Four_Me_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - IDK HOW.mp3"
  },
  {
    "title": "Wavy",
    "artist": "Karan Aujla",
    "album": "Wavy",
    "genre": "Pop",
    "duration": 161,
    "coverImage": "Karan_Aujla_Wavy_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - Wavy.mp3"
  },
  {
    "title": "WHO THEY?",
    "artist": "Karan Aujla",
    "album": "Four Me",
    "genre": "Pop",
    "duration": 203,
    "coverImage": "Karan_Aujla_Four_Me_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - WHO THEY.mp3"
  },
  {
    "title": "Y.D.G",
    "artist": "Karan Aujla",
    "album": "Four Me",
    "genre": "Pop",
    "duration": 172,
    "coverImage": "Karan_Aujla_Four_Me_cover.jpeg",
    "filePath": "KaranAujla/Karan Aujla - Y.D.G.mp3"
  },
  {
    "title": "Aura",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 166,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Aura.mp3"
  },
  {
    "title": "Bars",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 184,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Bars.mp3"
  },
  {
    "title": "Buckle Up",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 173,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Buckle Up.mp3"
  },
  {
    "title": "Carti",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 167,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Carti.mp3"
  },
  {
    "title": "Cheques",
    "artist": "Shubh",
    "album": "Still Rollin",
    "genre": "Rap",
    "duration": 184,
    "coverImage": "Shubh_Still_Rollin_cover.jpeg",
    "filePath": "Shubh/Shubh - Cheques.mp3"
  },
  {
    "title": "Fell For You",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 153,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Fell For You.mp3"
  },
  {
    "title": "In Love",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 230,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - In Love.mp3"
  },
  {
    "title": "Reckless",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 159,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Reckless.mp3"
  },
  {
    "title": "Routine",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 172,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Routine.mp3"
  },
  {
    "title": "Ruger",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 163,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Ruger.mp3"
  },
  {
    "title": "Top G",
    "artist": "Shubh",
    "album": "Sicario",
    "genre": "Rap",
    "duration": 165,
    "coverImage": "Shubh_Sicario_cover.jpeg",
    "filePath": "Shubh/Shubh - Top G.mp3"
  },
  {
    "title": "Ankh Uthi Mohabbat Ne",
    "artist": "Ustad Nusrat Fateh Ali Khan",
    "album": "Best Urdu Qawwalies",
    "genre": "Unknown Genre",
    "duration": 1163,
    "coverImage": "Ustad_Nusrat_Fateh_Ali_Khan_Best_Urdu_Qawwalies_cover.jpeg",
    "filePath": "Ustad Nusrat Fateh Ali Khan/Ustad Nusrat Fateh Ali Khan - Ankh Uthi Mohabbat Ne.mp3"
  },
  {
    "title": "Haq Ali Ali Maula",
    "artist": "Ustad Nusrat Fateh Ali Khan",
    "album": "Haq Ali Ali Maula Vol. 216",
    "genre": "Asian Music",
    "duration": 1749,
    "coverImage": "Ustad_Nusrat_Fateh_Ali_Khan_Haq_Ali_Ali_Maula_Vol__216_cover.jpeg",
    "filePath": "Ustad Nusrat Fateh Ali Khan/Ustad Nusrat Fateh Ali Khan - Haq Ali Ali Maula.mp3"
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
    console.log(`✅ ${sampleSongs.length} songs seeded successfully!`);
    
    // Log album statistics
    const albumStats = {};
    sampleSongs.forEach(song => {
      if (song.album !== 'Unknown Album') {
        albumStats[song.album] = (albumStats[song.album] || 0) + 1;
      }
    });
    
    console.log(`📀 Found ${Object.keys(albumStats).length} albums:`);
    Object.entries(albumStats).forEach(([album, count]) => {
      console.log(`   • ${album}: ${count} song${count !== 1 ? 's' : ''}`);
    });
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
