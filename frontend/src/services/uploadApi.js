import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Upload service for handling file uploads
export const uploadService = {
  // Upload user avatar
  uploadAvatar: async (file) => {
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('avatar', file);

      // Set the proper headers for file upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const res = await axios.post(`${API_URL}/api/uploads/avatar`, formData, config);
      return res.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Upload playlist cover
  uploadPlaylistCover: async (playlistId, file) => {
    try {
      const formData = new FormData();
      formData.append('cover', file);
      formData.append('playlistId', playlistId);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const res = await axios.post(`${API_URL}/api/uploads/playlist-cover`, formData, config);
      return res.data;
    } catch (error) {
      console.error('Error uploading playlist cover:', error);
      throw error;
    }
  }
};
