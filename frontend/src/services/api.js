import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data);
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.log('Authentication error - redirecting to login');
        // You could dispatch logout action or redirect here
      }
    } else if (error.request) {
      console.error('API Request Error (No response):', error.request);
    } else {
      console.error('API Config Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Song service
export const songService = {
  // Get all songs
  getAllSongs: async () => {
    try {
      const res = await apiClient.get('/api/songs');
      return res.data;
    } catch (error) {
      console.error('Error getting songs:', error);
      throw error;
    }
  },
  // Get song by ID
  getSongById: async (id) => {
    try {
      const res = await apiClient.get(`/api/songs/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error getting song ${id}:`, error);
      throw error;
    }
  },// Get favorite songs
  getFavorites: async () => {
    try {
      console.log('Fetching favorites from API');
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No auth token found - user likely not logged in');
        return [];
      }
      
      // Use our improved apiClient
      const res = await apiClient.get('/api/songs/favorites');
      console.log('Favorites API response:', res.data);
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error('Error getting favorite songs:', error);
      if (error.response && error.response.status === 401) {
        console.warn('User not authenticated for favorites');
      }
      return [];  // Return empty array on error for better error handling
    }
  },
  
  // Add song to favorites
  addToFavorites: async (songId) => {
    try {
      console.log(`Adding song ${songId} to favorites`);
      const res = await apiClient.post(`/api/songs/favorites/${songId}`);
      console.log('Add to favorites response:', res.data);
      
      // Return a more user-friendly response
      return {
        success: true,
        message: 'Song added to favorites',
        data: res.data
      };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to favorites'
      };
    }
  },

  // Remove song from favorites
  removeFromFavorites: async (songId) => {
    try {
      console.log(`Removing song ${songId} from favorites`);
      const res = await apiClient.delete(`/api/songs/favorites/${songId}`);
      console.log('Remove from favorites response:', res.data);
      
      // Return a more user-friendly response
      return {
        success: true,
        message: 'Song removed from favorites',
        data: res.data
      };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from favorites'
      };
    }
  },

  // Search for songs
  searchSongs: async (query) => {
    try {
      const res = await axios.get(`${API_URL}/api/songs/search/${query}`);
      return res.data;
    } catch (error) {
      console.error('Error searching songs:', error);
      throw error;
    }
  },

  // Get all albums
  getAlbums: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/songs/albums`);
      return res.data;
    } catch (error) {
      console.error('Error getting albums:', error);
      throw error;
    }
  },

  // Get all singles
  getSingles: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/songs/singles`);
      return res.data;
    } catch (error) {
      console.error('Error getting singles:', error);
      throw error;
    }
  },

  // Get songs by album
  getSongsByAlbum: async (albumName) => {
    try {
      const res = await axios.get(`${API_URL}/api/songs/album/${encodeURIComponent(albumName)}`);
      return res.data;
    } catch (error) {
      console.error(`Error getting songs for album ${albumName}:`, error);
      throw error;
    }
  }
};

// Playlist service
export const playlistService = {
  // Get all playlists
  getAllPlaylists: async () => {
    try {
      const res = await apiClient.get('/api/playlists');
      return res.data;
    } catch (error) {
      console.error('Error getting playlists:', error);
      throw error;
    }
  },

  // Get public playlists
  getPublicPlaylists: async () => {
    try {
      const res = await apiClient.get('/api/playlists/public');
      return res.data;
    } catch (error) {
      console.error('Error getting public playlists:', error);
      throw error;
    }
  },

  // Create new playlist
  createPlaylist: async (playlistData) => {
    try {
      const res = await apiClient.post('/api/playlists', playlistData);
      return res.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  // Update playlist details
  updatePlaylist: async (playlistId, updateData) => {
    try {
      const res = await apiClient.put(`/api/playlists/${playlistId}`, updateData);
      return res.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },

  // Upload playlist cover image
  uploadPlaylistCover: async (playlistId, file) => {
    try {
      const formData = new FormData();
      formData.append('coverImage', file);
      
      const res = await apiClient.put(`/api/playlists/${playlistId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error uploading playlist cover:', error);
      throw error;
    }
  },

  // Like/unlike playlist
  togglePlaylistLike: async (playlistId) => {
    try {
      const res = await apiClient.post(`/api/playlists/${playlistId}/like`);
      return res.data;
    } catch (error) {
      console.error('Error toggling playlist like:', error);
      throw error;
    }
  },

  // Add song to playlist
  addSongToPlaylist: async (playlistId, songId) => {
    try {
      const res = await apiClient.post(`/api/playlists/${playlistId}/songs/${songId}`);
      return res.data;
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
    }
  },

  // Remove song from playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      const res = await apiClient.delete(`/api/playlists/${playlistId}/songs/${songId}`);
      return res.data;
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      throw error;
    }
  },
  // Delete playlist
  deletePlaylist: async (playlistId) => {
    try {
      const res = await apiClient.delete(`/api/playlists/${playlistId}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  },

  // Get playlist by ID
  getPlaylistById: async (playlistId) => {
    try {
      const res = await apiClient.get(`/api/playlists/${playlistId}`);
      return res.data;
    } catch (error) {
      console.error(`Error getting playlist ${playlistId}:`, error);
      throw error;
    }
  },
    // Update playlist image
  updatePlaylistImage: async (playlistId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const res = await apiClient.put(
        `/api/playlists/${playlistId}/image`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      return res.data;
    } catch (error) {
      console.error('Error updating playlist image:', error);
      throw error;
    }
  },
  // Update playlist details
  updatePlaylist: async (playlistId, data) => {
    try {
      const res = await apiClient.put(`/api/playlists/${playlistId}`, data);
      return res.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },

  // Delete the "Favorites" playlist specifically
  deleteFavoritesPlaylist: async () => {
    try {
      const res = await apiClient.delete('/api/playlists/cleanup/favorites');
      return res.data;
    } catch (error) {
      console.error('Error deleting Favorites playlist:', error);
      throw error;
    }
  },
};
