import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import CreatePlaylist from './pages/CreatePlaylistNew';
import Library from './pages/Library';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AudioProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#1DB954',
                  secondary: '#fff'
                }
              }
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/liked-songs" 
            element={
              <ProtectedRoute>
                <LikedSongs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-playlist" 
            element={
              <ProtectedRoute>
                <CreatePlaylist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/playlist/:id" 
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </AudioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
