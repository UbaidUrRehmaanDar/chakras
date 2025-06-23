# Chakras – A Clean & Modern Music Player Web App

## Project Overview
Chakras is a Spotify-inspired music streaming web application built using the MERN stack (MongoDB, Express, React, Node.js). The application features a clean interface, audio streaming support, and user authentication, providing users with a seamless music listening experience.

## Features
- **User Authentication**: Secure login and registration using JWT.
- **Music Playback**: Stream static MP3 files with a simple audio player.
- **Music Library**: Browse songs with a modern UI.
- **Responsive Design**: Optimized for various screen sizes.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **Authentication**: bcryptjs, JWT
- **Requests**: Axios
- **Icons/UI**: Lucide Icons or Heroicons

## Folder Structure
```
chakras/
├── backend/
│   ├── models/
│   ├── music/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd chakras
   ```

2. Set up the backend:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file and add your MongoDB connection string.

3. Set up the frontend:
   - Navigate to the `frontend` directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

### Running the Application
1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

## Usage
- Navigate to `http://localhost:3000` to access the application.
- Use the login or register page to create an account or log in.
- Browse the music library and enjoy streaming your favorite songs.

## License
This project is licensed under the MIT License.